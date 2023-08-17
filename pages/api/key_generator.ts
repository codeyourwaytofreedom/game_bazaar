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
        const client = await connectToDatabase();
        const database = client.db('game-bazaar');
        const members = database.collection('members');
        const existingUser = await members.findOne({ steamId: steamID });

        if(existingUser){
            const url = existingUser.profile_img_url;
            const timeStamp = new Date();

            const key = keyMaker(steamID, url, timeStamp);
            console.log("Key created",key);
        }
        res.status(200).json({message:"Key Generator Route Working..."});
    }

    console.log(steamID);


    //-	“/profile” sayfasında API Key generate’lemek lazım (Kişinin steamID’si, oluşturduğu zaman, profil fotoğrafı hash’lenecek) 
}
