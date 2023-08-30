import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

import Cors from 'micro-cors';


const cors = Cors({
    allowMethods:["POST"],
    origin: "*"
  });

cors(handler as any);



/**
 * @swagger
 * /api/fetch_inventory:
 *   post:
 *     tags:
 *       - Fetch Inventory
 *     summary: Fetches inventory for given appId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               KEY:
 *                 type: string
 *               appId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Inventory:
 *                   type: object
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */




 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     console.log("DOC- Fetch Inventory");
 
     try {
         const KEY = typeof req.body !== "object" ? JSON.parse(req.body).KEY : req.body.KEY;
         const appId = typeof req.body !== "object" ? JSON.parse(req.body).appId : req.body.appId;

         const client = await connectToDatabase();
         const data_base = client.db('game-bazaar');
         const members = data_base.collection('members');

         const existingUser = await members.findOne({game_bazaar_api_key:KEY});
         const inventory = existingUser?.[`descriptions_${appId}`]

         if(inventory){
            res.status(200).json({ inventory });
         }
         else{
            res.status(404).json({message:"Inventory Not found"})
         }
     } catch (error) {
         console.error("Error:", error);
         res.status(400).json({ message: error });
     }
 }
 