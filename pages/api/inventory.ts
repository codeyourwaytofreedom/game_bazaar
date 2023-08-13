import type { NextApiRequest, NextApiResponse } from 'next';

const baseUrl = "https://community.cloudflare.steamstatic.com/economy/image";


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    try {
        console.log("Inventory endpoint accessed...");
        const appId = '730';
        const url = `https://api.steampowered.com/IEconService/GetInventoryItemsWithDescriptions/v1/?key=${process.env.STEAM}&steamid=${process.env.ID}&appid=${appId}&contextid=2&get_descriptions=true`;

        const response = await fetch(url);
        const data = await response.json();
        const descriptions = data.response.descriptions;

        console.log(descriptions);

        res.status(200).json(descriptions);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("Error");
    }
}
