import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

const baseUrl = "https://community.cloudflare.steamstatic.com/economy/image";
const codes = {
    csgo:"730", tm2:"440"
}
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    console.log("inventory api endpoint accessed");

    const client = await connectToDatabase();
    const data_base = client.db('game-bazaar');
    const members = data_base.collection('members');

    const idCookie = req.cookies.ID;
    const existingUser = await members.findOne({steamId:idCookie});

    const appId = req.query.game === "csgo" ? "730" : '440';

    if(existingUser){
        const existing_inventory = existingUser[`descriptions_${appId}`];
        if(!existing_inventory)    {
            console.log("ilk defa envanter ekleniyor price prop ile ve eklenmiş hali gönderiliyor")
            try {
                const url = `https://api.steampowered.com/IEconService/GetInventoryItemsWithDescriptions/v1/?key=${process.env.STEAM}&steamid=${process.env.ID}&appid=${appId}&contextid=2&get_descriptions=true`;
        
                const response = await fetch(url);
                const data = await response.json();
                const descriptions = data.response.descriptions;
                if(descriptions){
                    const descriptions_with_prices = descriptions.map((game_item:any) => {return {...game_item, price:0}})
                    await members.updateOne(
                        { steamId: idCookie },
                        { $set: { [`descriptions_${appId}`]: descriptions_with_prices } }
                      );
                    res.status(200).json(descriptions_with_prices);
                }
                else{
                    res.status(404).send("not found")
                }        
            } catch (error) {
                console.error("Error:", error);
                res.status(500).json("Error");
            } 
        }
        else{
            console.log("mevcut price lı obje gönderildi")
            res.status(200).json(existingUser[`descriptions_${appId}`]);
        }
    }
    else{
        console.log("must login")
    }
}
