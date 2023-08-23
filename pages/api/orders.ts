import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "./db";

export default async function orders_fetcher (req:NextApiRequest, res:NextApiResponse) {
    console.log("Orders fetcher endpoint accessed...");

    const idCookie = req.cookies.ID;
    const item = req.query.item
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

    console.log(item);
    console.log(steamID);

    if(steamID && item){
        const client = await connectToDatabase();
        const db = client.db('game-bazaar');
        const members = db.collection('members');

    }

    res.send("ok");
}