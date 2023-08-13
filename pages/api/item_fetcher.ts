import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const item_details = {
        item_name:"M4A4 | Urban DDPAT (Field-Tested)",
        item_quality:"Industrial Grade",
        item_category:"Normal",
        item_type:"Rifles",
        item_price:3.55,
        XX:["January", "February","March","April","May","June","July","August","September"],
        YY:[6,3,3,4,5,9,3,7,1],
        sellers:[
            {seller:"Seller A",price:3.5},{seller:"Seller B",price:4.5},{seller:"Seller C",price:5.5},
            {seller:"Seller D",price:6.5},{seller:"Seller E",price:7.5}
        ]
    }
    console.log("Item details to be sent to client");
    res.status(200).json(item_details)
}