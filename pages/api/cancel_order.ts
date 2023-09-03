import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "./db";

export default async function order_handle(req:NextApiRequest, res:NextApiResponse) {
    
    console.log("CANCEL ORDER...");

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

    const order_to_cancel = JSON.parse(req.body);

    const sellerId = order_to_cancel.sellerId;
    const buyer_id = order_to_cancel.buyer_id;

    console.log(buyer_id === steamID);

    try{
        const client = await connectToDatabase();
        const db =   client.db('game-bazaar');
        const members = db.collection('members');
    
        const result_from_seller = await members.updateOne(
            {
                steamId:order_to_cancel.sellerId,
    
            },
            {
                $pull:{
                    they_ordered:order_to_cancel
                }
            }
        )
        const result_from_buyer = await members.updateOne(
            {
                steamId:order_to_cancel.buyer_id,
                
            },
            {
                $pull:{
                    I_ordered:order_to_cancel
                }
            }
        )
    
        if (result_from_seller.modifiedCount > 0 && result_from_buyer.modifiedCount > 0) {
            res.status(200).json({message:"ORDER CANCELLED ***", color:"green"})
        } else {
            res.status(400).json({message:"FAILED TO CANCEL ORDER ***", color:"red"})
        }
    }catch(err){
        res.status(500).json({message:"INTERNAL SERVICE ERROR ***", color:"red"})
    }

}