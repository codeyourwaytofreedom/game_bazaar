import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

/**
 * @swagger
 * /api/price_update:
 *   post:
 *     tags:
 *       - Price
 *     description: Update item price for a user.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: JSON object containing item details.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             classid:
 *               type: string
 *               description: ID of the item class.
 *             price:
 *               type: number
 *               description: New price of the item.
 *             appId:
 *               type: string
 *               description: ID of the application.
 *     responses:
 *       200:
 *         description: Price updated successfully.
 *       404:
 *         description: Document Not Found.
 *       401:
 *         description: Unauthorized Login Required.
 *       500:
 *         description: An error occurred while processing the request.
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
    const item_new_price = client_input.price; 
    const item_group = client_input.appId;

    console.log(client_input);
    
    if(existingUser){
        if(item_new_price){
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
