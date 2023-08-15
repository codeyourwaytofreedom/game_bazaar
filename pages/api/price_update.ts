import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";


export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    console.log("inventory api endpoint accessed");

    const client = await connectToDatabase();
    const data_base = client.db('game-bazaar');
    const members = data_base.collection('members');

    const steamID = req.cookies.ID;
    const existingUser = await members.findOne({steamId:steamID});

    const client_input = JSON.parse(req.body)
    const item_classid = client_input.classid;
    const item_new_price = client_input.price; 
    const item_group = client_input.appId;

    
    if(existingUser){
        if(item_new_price){
            const inventory = await existingUser[`descriptions_${item_group}`];
            const itemToUpdate = inventory.find((item:any) => item.classId === item_classid);
            if(itemToUpdate){
                const updateQuery = {
                    steamId: steamID,
                    [`descriptions_${item_group}.classId`]: item_classid
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
