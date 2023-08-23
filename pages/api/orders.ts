import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "./db";

export default async function orders_fetcher (req:NextApiRequest, res:NextApiResponse) {
    console.log("Orders fetcher endpoint accessed...");

    const idCookie = req.cookies.ID;
    const item_name = req.query.item;
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

    console.log(item_name);
    console.log(steamID);

    if(steamID && item_name){
        const client = await connectToDatabase();
        const db = client.db('game-bazaar');
        const members = db.collection('members');

        const buy_orders = await members.aggregate([
            {
                $project: {
                    _id: 0,
                    steamId:1,
                    delivery_time:1,
                    matchingOrders: {
                        $filter: {
                            input: "$orders",
                            as: "order",
                            cond: { $eq: ["$$order.orderedItem", item_name] }
                        }
                    }
                }
            }
          ]).toArray();
        
        console.log(buy_orders);
        res.status(200).json(buy_orders);
    }
    else{
        res.status(404).json({message:"Not found !!!"})
    }
}