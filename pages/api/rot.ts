import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const url = `https://api.steampowered.com/IEconService/GetTradeOffers/v1?key=${process.env.STEAM}&get_sent_offers=true&get_received_offers=true&get_descriptions=true&language=en&active_only=false&historical_only=false&time_historical_cutoff=0`

    console.log("Fast api test route")
    try{        
        const response = await fetch(url);
        const status = response.status;
        const resJson = await response.json();

        console.log(resJson.response);

        res.send("OK")


    }
    catch(err){
        console.log(err)
        res.send("problem")
    }
}
