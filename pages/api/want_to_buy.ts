import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "./db";

export default async function order_handle(req:NextApiRequest, res:NextApiResponse) {
    
    console.log("Want to buy");

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

    const buy_order_details = JSON.parse(req.body);

    buy_order_details.buyer_id = steamID;

    const sellerId= buy_order_details.sellerId;
    const assetid =  buy_order_details.assetid;
    const delivery_time = buy_order_details.delivery_time;
    const image = buy_order_details.image;
    const trade_link = buy_order_details.trade_link;
    const price = buy_order_details.price;

    //console.log(sellerId,assetid,delivery_time,image,trade_link,price)
    
    const client = await connectToDatabase();
    const db =   client.db('game-bazaar');
    const members = db.collection('members');
    const existingUser = await members.findOne({steamId:steamID})


    if(existingUser){
        if(existingUser.trade_link){
            const balance = existingUser.balance;
            const balanceEnough = parseFloat(balance) > parseFloat(buy_order_details.price);
            
            const existingOrder = await members.findOne({
                steamId: sellerId,
                they_ordered: {
                    $elemMatch: {
                        sellerId: sellerId,
                        assetid: assetid,
                        delivery_time:delivery_time,
                        image:image,
                        trade_link:trade_link,
                        price:price,
                        buyer_id:steamID
                    }
                }
            });
            
            if(existingOrder){
                res.status(500).json({ message: "IDENTICAL ORDER.", color:"red"});
            }
            else if(sellerId === steamID){
                res.status(500).json({ message: "CAN'T PLACE BUY ORDER FOR YOUR OWN ITEMS.", color:"red"});
            }
            else{
                if(balanceEnough){
                    const result = await members.updateOne(
                        { steamId: sellerId },
                        {
                            $push: {
                                they_ordered: buy_order_details
                            }
                        }
                    );
                    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
                        console.log('Update was successful.');
                        res.status(200).json({message:"BUY ORDER placed !!!", color:"green"});
                    } else {
                        res.status(500).json({ message: "Failed to place BUY ORDER.", color:"red"});
                    }
                }
                else{
                    res.status(401).json({message:"Insufficient Balance !!!", color:"red"});
                }
            }
        }
        else{
            res.status(400).json({message:"Trade Link missing...Please save your trade link in your profile page", color:"red"});
        }
    }
    else{
        res.status(401).json({message:"Login Required !!!", color:"red"});
    }
}