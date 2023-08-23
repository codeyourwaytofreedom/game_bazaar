import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "./db";

export default async function order_handle(req:NextApiRequest, res:NextApiResponse) {
    console.log("Place Order Endpoint accessed");
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

    const order_details = JSON.parse(req.body);
    const price = parseFloat(order_details.price);
    const quantity = parseInt(order_details.quantity);
    const name = order_details.name;

    console.log(steamID, price, quantity);

    const client = await connectToDatabase();
    const db =   client.db('game-bazaar');
    const members = db.collection('members');
    const existingUser = await members.findOne({steamId:steamID})

    if(existingUser){
        const balance = existingUser.balance;
        const balanceEnough = parseFloat(balance) > price*quantity;
        if(balanceEnough){
            const result = await members.updateOne(
                { steamId: steamID },
                {
                    $push: {
                        orders: {
                            orderedItem: name,
                            orderedQuantity: quantity,
                            orderedPrice: price
                        }
                    }
                }
            );
            if (result.modifiedCount > 0 || result.upsertedCount > 0) {
                console.log('Update was successful.');
                res.status(200).json({message:"Orders placed !!!", color:"green"});
            } else {
                res.status(500).json({ message: "Failed to place order.", color:"red"});
            }
        }
        else{
            res.status(401).json({message:"Insufficient Balance !!!", color:"red"});
        }
    }
    else{
        res.status(401).json({message:"Login Required !!!", color:"red"});
    }
}