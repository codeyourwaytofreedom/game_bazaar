import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("API key to be verified");
    const apiKeyPattern = /^[A-Fa-f0-9]{32}$/;
    console.log(apiKeyPattern.test(req.body));


    const apiKey = req.body;
    const cookies = parse(req.headers.cookie || '');
    const idTitleCookie = cookies.ID;

    if(idTitleCookie){
        const splitted = idTitleCookie.split("/");
        const id = splitted[splitted.length-1];
        const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${id}`);
        const response_inventory = await fetch(`https://api.steampowered.com/IEconService/GetInventoryItemsWithDescriptions/v1/?key=${apiKey}&steamid=${id}`);

        const data = await response.json();
        const data_inventory = await response_inventory.json();

        if(data.response.players && data.response.players.length > 0){
            console.log("found");
            console.log(data.response.players[0]);
            res.status(200).send('OK');
        }
        else{
            res.status(404).send('null');
        }
    }
    else{
        res.status(404).send('null');
    }

}