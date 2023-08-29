import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";


/**
 * @swagger
 * /api/remove_from_sale:
 *   post:
 *     tags:
 *       - Price
 *     description: Removes item from sale...
 *     parameters:
 *       - name: classid
 *         in: body
 *         description: ID of the class to identify the item.
 *         required: true
 *         schema:
 *           type: string
 *       - name: appId
 *         in: body
 *         description: ID of the application to identify the item.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Price updated"
 *       404:
 *          description: "Document Not Found"
 *       401:
 *          description: "Unauthorized: Login Required"
 */

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

    const existingUser = await members.findOne({steamId:steamID});

    const client_input = JSON.parse(req.body)
    const item_classid = client_input.classid;
    const item_group = client_input.appId;

    console.log(client_input);
    
    if(existingUser){
            const inventory = await existingUser[`descriptions_${item_group}`];
            const itemToUpdate = inventory.find((item:any) => item.classid === item_classid);
            console.log(itemToUpdate);
            
            if(itemToUpdate){
                const updateQuery = {
                    steamId: steamID,
                    [`descriptions_${item_group}.classid`]: item_classid
                  };
              
                const updateOperation = {
                $set: {
                    [`descriptions_${item_group}.$.price`]: 0
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
        res.status(401).send("Unauthorized: Login Required");
    }
}
