import { NextApiRequest, NextApiResponse } from 'next';
import SteamID from 'steamid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("TRADE MATCH ENDPOINT...");

    const url = `https://api.steampowered.com/IEconService/GetTradeOffers/v1?key=${process.env.STEAM}&get_sent_offers=true&get_received_offers=true&get_descriptions=true&language=en&active_only=false&historical_only=false&time_historical_cutoff=0`
    
    const get_Seller_trade_offers_sent = async (key:string) => {
        const rotated_url = `https://markt.tf/trade/${key}?seller=true`;
        try{        
            const response = await fetch(rotated_url);
            const status = response.status;
            if(status === 200){
                const resText = await response.json(); //returns string
                const resJson = JSON.parse(resText); //objectified
                const data = resJson.response;
                const trade_offers_sent = data.trade_offers_sent;
                return {trade_offers_sent}
            }
        }
        catch(err){
            return err
        }
    }

    const seller_data:any = await get_Seller_trade_offers_sent(process.env.STEAM!);
    
    console.log(seller_data.trade_offers_sent)

    res.status(200).json({message:"Trades object received"})
}
