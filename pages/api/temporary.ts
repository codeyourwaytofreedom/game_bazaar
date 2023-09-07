import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    console.log("TEMPORARY TEST");

    const rotated_url = `https://markt.tf/inventory/${process.env.ID}/${process.env.STEAM}/${440}`;
    const response = await fetch(rotated_url);
    
    const restext = await response.json();
    const data = JSON.parse(restext);

    //console.log(data.response.descriptions);
    data.response.descriptions.map((e:any,i:number)=>console.log(i,": ",e.market_hash_name));

    res.send("OK")
}