import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

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

    const client = await connectToDatabase();
    const data_base = client.db('game-bazaar');
    const members = data_base.collection('members');

    const client_input = JSON.parse(req.body)
    const item_assetid = client_input.assetid;
    const item_new_price = parseFloat(client_input.price); 
    console.log(typeof item_new_price, item_new_price)
    const item_group = client_input.appId;
    const KEY = client_input.KEY;

    console.log(client_input);

    const existingUser = await members.findOne({steamId:steamID});
    
    if(existingUser){
        if(item_new_price){
            const inventory = await existingUser[`descriptions_${item_group}`];
            const itemToUpdate = inventory.find((item:any) => item.assetid === item_assetid);
            //console.log(itemToUpdate);
            
            if(itemToUpdate){
                const updateQuery = {
                    steamId:steamID,
                    [`descriptions_${item_group}.assetid`]: item_assetid
                  };
              
                const updateOperation = {
                $set: {
                    [`descriptions_${item_group}.$.price`]: item_new_price
                }
                };
                const update_result = await members.updateOne(updateQuery, updateOperation);
    
                if (update_result.matchedCount > 0 && update_result.modifiedCount > 0) {
                    console.log("Update successful");
                    res.status(200).send("Price updated");
                  } else {
                    console.log("Update did not modify any document");
                    res.status(200).send("Price couldn't update!");
                  }
            }
            else{
                res.status(404).send("Document Not Found!")
            }
        }
        else{
            console.log("invalid input coming")
        }
    }
    else{
        res.status(401).send("Unauthorized: Login Required");
    }
}
