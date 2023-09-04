import { NextApiRequest, NextApiResponse } from 'next';
import SteamID from 'steamid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("TRADE MATCH ENDPOINT...");

    
    const get_Seller_trade_offers_sent = async (key:string, seller:boolean) => {
        const rotated_url = `https://markt.tf/trade/${key}?seller=${seller}`;
        try{        
            const response = await fetch(rotated_url);
            const status = response.status;
            if(status === 200){
                const resText = await response.json(); //returns string
                const resJson = JSON.parse(resText); //objectified
                const data = resJson.response;
                console.log(data)
                const trade_offers_sent = data.trade_offers_sent;
                const relevant_users:any = [];

                trade_offers_sent.forEach((offer:any) => {
                    const pure_id = SteamID.fromIndividualAccountID(offer.accountid_other).getSteamID64();
                    relevant_users.push(pure_id);
                    //console.log(offer)
                });

                console.log(relevant_users)

                return {trade_offers_sent, relevant_users}
            }
        }
        catch(err){
            return err
        }
    }

    const seller_data:any = await get_Seller_trade_offers_sent(process.env.STEAM!, false);
    const sent_by_Seller = seller_data.trade_offers_sent;
    
    //console.log(sent_by_Seller)
    
/*     const buyer_data:any = await get_Seller_trade_offers_sent(process.env.BUYER!, true);
    console.log(buyer_data.trade_offers_sent) */


    res.status(200).json({message:"Trades object received"})
}
