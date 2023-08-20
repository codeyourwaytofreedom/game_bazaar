
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';
import buffer from 'raw-body';


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
    const buf = await buffer(req)

    try {
     const event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.SECRETKEY_WEBHOOK);
      if(event.type === 'checkout.session.completed'){
          const session = event.data.object;
          if(session.payment_status === "paid"){
            console.log("The amount successfully paid is :",session.amount_total)
          }
      }
    } 
    catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
  res.send("OK");
}