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
 *     summary: Fetches the square of a number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: integer
 *             example:
 *               result: 49
 */




 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     console.log("DOC- Fetch Inventory");
 
     try {
         const input = typeof req.body !== "object" ? JSON.parse(req.body).number : req.body.number;
         const int_input = parseInt(input);
         const square = int_input * int_input;
 
         console.log(square);
 
         res.status(200).json({ result: square });
     } catch (error) {
         console.error("Error:", error);
         res.status(400).json({ message: "Invalid input" });
     }
 }
 