
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';
import buffer from 'raw-body';
import {connectToDatabase} from "./db";


const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

cors(handler as any);

const stripe = require("stripe")(process.env.PAYMENT_KEY);
const base_url = process.env.NODE_ENV === "development" ? 'http://localhost:3000' : "https://game-bazaar.vercel.app";

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    const buf = await buffer(req);

    try {
     const event = await stripe.webhooks.constructEvent(buf.toString(), sig, process.env.SECRETKEY_WEBHOOK);
      if(event.type === 'checkout.session.completed'){
          const session = event.data.object;
          const steamId = session.client_reference_id;

          const amount_to_balance = parseFloat(session.metadata.amount_to_balance);

          console.log(amount_to_balance);    

          if(session.payment_status === "paid"){
            console.log("The amount successfully paid is :",session.amount_total);

            const client = await connectToDatabase();
            const data_base = client.db('game-bazaar');
            const members = data_base.collection('members');

            const existingUser = await members.findOne({steamId:steamId});

            members.updateOne(
              {steamId:steamId},
              {$inc:{balance:amount_to_balance}},
            )
            res.status(200).json({message:"Payment Successful"});
          }
      }
      else{
        res.send("OK")
      }
    } 
    catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
}