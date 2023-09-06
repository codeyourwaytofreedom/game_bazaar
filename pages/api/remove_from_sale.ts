import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";


/**
 * @swagger
 * /api/remove_from_sale:
 *   post:
 *     tags:
 *       - Remove from Sale
 *     summary: Removes item from sale...
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetid:
 *                 type: string
 *               appId:
 *                 type: string
 *               KEY:
 *                 type: string
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

    const client_input = typeof req.body !== "object" ? JSON.parse(req.body) : (req.body);

    //const client_input = JSON.parse(req.body)
    const item_assetid = client_input.assetid;
    const item_group = client_input.appId;
    const KEY = client_input.KEY;
    const KEY_owner = await members.findOne({steamId:steamID});
    const KEY_from_DB = KEY_owner?.game_bazaar_api_key;

    console.log(KEY, KEY_from_DB)

    //console.log(client_input);
    

    const existingUser = await members.findOne({game_bazaar_api_key:KEY ?? KEY_from_DB});

    
    if(existingUser){
            const inventory = await existingUser[`descriptions_${item_group}`];
            const itemToUpdate = inventory.find((item:any) => item.assetid === item_assetid);
            console.log(itemToUpdate);
            
            if(itemToUpdate){
                const updateQuery = {
                    game_bazaar_api_key:KEY ?? KEY_from_DB,
                    [`descriptions_${item_group}.assetid`]: item_assetid
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
