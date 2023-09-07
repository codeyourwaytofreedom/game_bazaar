import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    console.log("TEMPORARY TEST");

    const rotated_url = `https://markt.tf/inventory/${process.env.ID}/${process.env.STEAM}/${440}`;
    const response = await fetch(rotated_url);
    
    const restext = await response.json();
    const data = JSON.parse(restext);

    const assets = data.response.assets;
    const descriptions = data.response.descriptions;

    //console.log(data.response.assets)

    let pool:any = [];

    assets.forEach((asset: any, assetInd: any) => {
        descriptions.forEach((desc: any, descInd: any) => {
            if (asset.classid === desc.classid && asset.instanceid === desc.instanceid && desc.tradable) {
                const objectWithAssetId = { ...desc, assetid: asset.assetid };
                pool.push(objectWithAssetId);
            }
        });
    });
    


    //pool.map((e:any)=> console.log(e.assetid," : ", e.market_hash_name))
    //console.log(pool.length)

    //data.response.descriptions.map((e:any,i:number)=>console.log(i,": ",e.market_hash_name));

    res.send("OK")
}