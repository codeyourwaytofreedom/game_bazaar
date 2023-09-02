import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("TRADE LINK ADDER");

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
        }
    }



    const trade_link = req.body;

    if(steamID){
        const client = await connectToDatabase();
        const data_base = client.db('game-bazaar');
        const members = data_base.collection('members');

        const existingUser = await members.findOne({steamId:steamID});

        if(existingUser){
            const result = await members.updateOne(
                {steamId:steamID},
                {
                    $set: {
                        trade_link:trade_link
                    }
                }
            )
            if (result.modifiedCount === 1) {
                res.status(200).json({message:"Trade Link added...Start placing orders*", color:"green"})
              } else {
                res.status(200).json({message:"No changes were made*", color:"gold"})
              }
        }
    }
    else{
        res.status(401).json({message:"Login Required !!!", color:"red"});
    }
}