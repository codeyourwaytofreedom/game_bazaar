import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

import Cors from 'micro-cors';


const cors = Cors({
    origin: "*"
  });

cors(handler as any);


export const config = {
  api: {
    bodyParser: false,
  },
}


export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    console.log("DOC- Fetch Inventory");
    res.status(200).json({test:"Emre bey bu metni görüyorsanız CORS çalışıyor demektir"})

}