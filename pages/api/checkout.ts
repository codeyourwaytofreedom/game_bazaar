
import type { NextApiRequest, NextApiResponse } from 'next';

const stripe = require("stripe")(process.env.PAYMENT_KEY);
const base_url = process.env.NODE_ENV === "development" ? 'http://localhost:3000' : "https://game-bazaar.vercel.app";


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  //console.log("Checkout route accessed");
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

  const amount = parseFloat(req.body)*(1.029) + 0.3;
  const amount_cent = Math.floor(amount*100);  

  try {
    const session = await stripe.checkout.sessions.create({
      "payment_method_types": [
        "card"
      ],
      "mode": "payment",
      "currency": "usd",
      "line_items": [{
          price_data: {
            currency: "usd",
            product_data: { name: "Auction Attendance Fee" },
            unit_amount: amount_cent
          },
          quantity: 1
        }],
      "success_url": `${base_url}/profile`,
      "cancel_url": `${base_url}/`,
      "client_reference_id": steamID,
      "metadata": {
        "amount_to_balance": parseFloat(req.body),
      }
    });
    res.status(200).json(session.url);
  } catch {
    res.status(500).json({message:"Oops! Something went wrong.."});
  }
}
