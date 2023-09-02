import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "./db";

export default async function order_handle(req:NextApiRequest, res:NextApiResponse) {
    
    console.log("SHOW TRADES");

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

    
    const client = await connectToDatabase();
    const db =   client.db('game-bazaar');
    const members = db.collection('members');
    const existingUser = await members.findOne({steamId:steamID})

    res.send("OK")
}