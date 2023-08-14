
import type { NextApiRequest, NextApiResponse } from 'next';

const stripe = require("stripe")(process.env.PAYMENT_KEY);
const base_url = process.env.NODE_ENV === "development" ? 'http://localhost:3000/' : "https://game-bazaar.vercel.app/";


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    console.log("Checkout route accessed")
    const session = await stripe.checkout.sessions.create({
      "payment_method_types": [
        "card"
      ],
      "mode": "payment",
      "currency": "gbp",
      "line_items": [{
          price_data: {
            currency: "gbp",
            product_data: { name: "Auction Attendance Fee" },
            unit_amount: 600
          },
          quantity: 1
        }],
      "success_url": `${base_url}/profile`,
      "cancel_url": `${base_url}/`,
    });
    res.send(session.url);
  } catch {
    res.send("Oops! Something went wrong..");
  }
}
