import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";


import Cors from 'micro-cors';


const cors = Cors({
    origin: "*",
    allowMethods: ["POST"]
  });
  

cors(handler as any);

/**
 * @swagger
 * /api/list_items:
 *   post:
 *     tags:
 *       - Items
 *     description: Fetches items listed by the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               KEY:
 *                 type: string
 *     responses:
 *       200:
 *         description: Items listed by the user retrieved successfully.
 *         content:
 *           application/json:
 *             example:
 *               - item1
 *               - item2
 *               - item3
 *       401:
 *         description: Not authorized. User is not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               message: Not authorized XXX
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: Not found XXX
 */


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("List my items endpoint accessed");

    const KEY  = typeof req.body !== "object" ? JSON.parse(req.body).KEY : req.body.KEY;


    if(KEY){
        const client = await connectToDatabase();
        const data_base = client.db('game-bazaar');
        const members = data_base.collection('members');

        const existingUser = await members.findOne({game_bazaar_api_key:KEY});
        if(existingUser){
            const descriptions = Object.keys(existingUser).filter(property => property.includes("descriptions"));
            let listed_items:any = [];
            descriptions.map(d => listed_items.push(existingUser[`${d}`].filter((item:any) => item.price !== 0)));
            res.status(200).json(listed_items)
        }
        else{
            res.status(404).json({message:"Not found XXX"})
        }
    }
    else{
        res.status(401).json({message:"Not authorized XXX"})
    }
}