import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";


/**
 * @swagger
 * /api/list_items:
 *   get:
 *     description: Fetches items listed by the authenticated user.
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
    if(steamID){
        const client = await connectToDatabase();
        const data_base = client.db('game-bazaar');
        const members = data_base.collection('members');

        const existingUser = await members.findOne({steamId:steamID});
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