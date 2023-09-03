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

    if(existingUser){
        //console.log(existingUser.they_ordered)
        const they_ordered = existingUser.they_ordered;
        const I_ordered = existingUser.I_ordered;
        

        res.status(200).json({they_ordered:they_ordered, I_ordered:I_ordered})
/*         if(they_ordered){
            res.status(200).json(they_ordered)
        }
        else{
            res.status(404).json({message:"NO ORDERS YET...", color:"red"});
        } */
        
    }
    else{
        res.status(401).json({message:"Login Required !!!", color:"red"});
    }
}