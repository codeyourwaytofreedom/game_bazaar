import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

/* import Cors from 'micro-cors';


const cors = Cors({
    origin: "*"
  });

cors(handler as any); */


export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    console.log("DOC- Fetch Inventory");

    const input = JSON.parse(req.body).number;
    const int_input = parseInt(input);
    const square = int_input*int_input;

    console.log(square)


    res.status(200).json({result:square})

}