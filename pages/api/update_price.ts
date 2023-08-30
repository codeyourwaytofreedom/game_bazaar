import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

/**
 * @swagger
 * /api/update_price:
 *   post:
 *     tags:
 *       - Price update
 *     summary: Updates item price...
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classid:
 *                 type: string
 *               appId:
 *                 type: string
 *               price:
 *                 type: number
 *               KEY:
 *                 type: string
 *     responses:
 *       200:
 *         description: Price updated successfully.
 *       400:
 *         description: Invalid input. Check your request data.
 *       404:
 *         description: Document Not Found.
 *       401:
 *         description: Unauthorized Login Required.
 *       500:
 *         description: An error occurred while processing the request.
 */


export default async function handler(req:NextApiRequest, res:NextApiResponse) {

/*     const idCookie = req.cookies.ID;
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
    } */

    const client = await connectToDatabase();
    const data_base = client.db('game-bazaar');
    const members = data_base.collection('members');

    const client_input = typeof req.body !== "object" ? JSON.parse(req.body) : (req.body);

    //const client_input = JSON.parse(req.body)
    const item_classid = client_input.classid;
    const item_new_price = client_input.price; 
    const item_group = client_input.appId;
    const KEY = client_input.KEY;

    console.log(client_input);

    const existingUser = await members.findOne({game_bazaar_api_key:KEY});
    
    if(existingUser){
        if(item_new_price){
            const inventory = await existingUser[`descriptions_${item_group}`];
            const itemToUpdate = inventory.find((item:any) => item.classid === item_classid);
            console.log(itemToUpdate);
            
            if(itemToUpdate){
                const updateQuery = {
                    game_bazaar_api_key: KEY,
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
            res.status(400).json({message:"Invalid Input"});
        }
    }
    else{
        res.status(401).send("Unauthorized: Login Required");
    }
}
