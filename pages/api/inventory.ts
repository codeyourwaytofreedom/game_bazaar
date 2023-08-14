import type { NextApiRequest, NextApiResponse } from 'next';

const baseUrl = "https://community.cloudflare.steamstatic.com/economy/image";
const codes = {
    csgo:"730", tm2:"440"
}
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    try {
        const game = req.query.game;
        console.log("Inventory endpoint accessed...",game);
        const appId = req.query.game === "csgo" ? "730" : '440';
        const url = `https://api.steampowered.com/IEconService/GetInventoryItemsWithDescriptions/v1/?key=${process.env.STEAM}&steamid=${process.env.ID}&appid=${appId}&contextid=2&get_descriptions=true`;

        const response = await fetch(url);
        const data = await response.json();
        const descriptions = data.response.descriptions;
        if(descriptions){
            res.status(200).json(descriptions);
        }
        else{
            res.status(404).send("not found")
        }

        //console.log(descriptions);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("Error");
    }
}
