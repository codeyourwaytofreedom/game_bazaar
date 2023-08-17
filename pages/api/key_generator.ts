import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";
import crypto from 'crypto';


const keyMaker = (steamid:string, url:string,timestamp:Date) => {
    const concatenatedString = [steamid,url, timestamp.toString()].join('|');
    const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');
    return hash;
  }


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    console.log("Key generator api endpoint accessed");
    const idCookie = req.cookies.ID;
    let steamID;

    if(idCookie){
        const isSteamOpenIDURL = idCookie.includes("https://steamcommunity.com/openid/id/");
        if(isSteamOpenIDURL){
            const parts = idCookie.split("/");
            steamID = parts[parts.length - 1];
        }
        else {
            steamID = idCookie;
            console.log("direk id")
        }
    }
    if(!steamID){
        res.status(401).json({message:"Login Required"});
    }
    /* User Logged In */
    else{
        try{
            const client = await connectToDatabase();
            const database = client.db('game-bazaar');
            const members = database.collection('members');
            const existingUser = await members.findOne({ steamId: steamID });
    
            if(existingUser){
                const url = existingUser.profile_img_url;
                const timeStamp = new Date();
    
                const key = keyMaker(steamID, url, timeStamp);

                const result = await members.updateOne(
                    {steamId:steamID},
                    {$set:{game_bazaar_api_key:key}}
                )

                if (result.matchedCount > 0) {
                    if (result.modifiedCount > 0) {
                        console.log("User key updated successfully");
                        const updated_user = await members.findOne({steamId:steamID});
                        if(updated_user){
                            const profile_details = {
                                id: updated_user.steamId,
                                balance: updated_user.balance,
                                email:updated_user.email,
                                delivery: updated_user.delivery_time,
                                game_bazaar_api_key:updated_user.game_bazaar_api_key
                            }
                            res.status(200).json({updated_user:profile_details});
                        }
                    } else {
                        console.log("No updates were made");
                        res.status(200).json({ message: "No updates were made" });
                    }
                } else {
                    console.log("User not found");
                    res.status(404).json({message:"User not found !!!"})
                }
            }
        }
        catch(error){
            console.log("errrrrrrrrr",error);
            res.status(500).json({ error: "An error occurred while processing the request." });
        }
    }

    console.log(steamID);


    //-	“/profile” sayfasında API Key generate’lemek lazım (Kişinin steamID’si, oluşturduğu zaman, profil fotoğrafı hash’lenecek) 
}
