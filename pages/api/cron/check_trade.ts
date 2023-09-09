import { NextApiRequest, NextApiResponse } from 'next';
import SteamID from 'steamid';
import { connectToDatabase } from '../db';
import _ from 'lodash';
import { fetch_new_inventory } from '../../../tools';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("TRADE MATCH ENDPOINT...");
    const get_trade_offers = async (key:string, seller:boolean) => {
        const rotated_url = `https://markt.tf/trade/${key}?seller=${seller}`;
        try{        
            const response = await fetch(rotated_url);
            const status = response.status;
            if(status === 200){
                const resText = await response.json(); //returns string
                const resJson = JSON.parse(resText); //objectified
                const data = resJson.response;

                //console.log(data)
  
                if(seller){
                    const trade_offers = data.trade_offers_sent;
                    trade_offers.forEach((offer:any) => {
                        const pure_id = SteamID.fromIndividualAccountID(offer.accountid_other).getSteamID64();
                        offer.pure_id = pure_id;
                    });    
                    return {trade_offers}
                }
                else{
                    const trade_offers = data.trade_offers_received;
                    trade_offers.forEach((offer:any) => {
                        const pure_id = SteamID.fromIndividualAccountID(offer.accountid_other).getSteamID64();
                        offer.pure_id = pure_id;
                    });
    
                    return {trade_offers}
                }
            }
        }
        catch(err){
            return err
        }
    }


    // retrieve trade objects from member documents
    try{
        const client = await connectToDatabase();
        const data_base = client.db('game-bazaar');
        const members = data_base.collection('members');

/*         const fetch_new_inventory = async (steamId:string,steam_api_key:string,appId:string) => {
            try {
                const rotated_url = `https://markt.tf/inventory/${steamId}/${steam_api_key}/${appId}`;
                const response = await fetch(rotated_url);
                
                const restext = await response.json();
                const data = JSON.parse(restext);
    
                const descriptions = data.response.descriptions;
                const assets = data.response.assets;
    
                assets.forEach((asset:any,assetInd:any) => {
                    descriptions.forEach((desc:any, descInd:any) => {
                        //console.log(asset.classid === desc.classid, asset.instanceid === desc.instanceid);
                        if(asset.classid === desc.classid && asset.instanceid === desc.instanceid){
                            descriptions[descInd].assetid = asset.assetid
                        }
                    });
                });
                return descriptions
        
            } catch (error) {
                return null
            } 
        } */

        
        const cursor = members.find({ "they_ordered": { $exists: true } });
        
        for await (const member of cursor) {
            const orders = member.they_ordered;
            for (const order of orders) {
                const appId = order.appid;
                const order_assetid = order.assetid;
                const when = order.when;
                const delivery_time = order.delivery_time;
                const time_space_in_seconds = delivery_time === "12 hr" ? 12*3600 : 15*60;

                const difference = (new Date().getTime() - new Date(when).getTime()) / 1000;

                const expired = time_space_in_seconds - difference < 0;

                if(order.status === "Pending"){
                    const price = parseFloat(order.price)

                    console.log("assetid of the order",order_assetid, order.sellerId);

                    const seller_id = order.sellerId;
                    const seller = await members.findOne({steamId:seller_id});
                    const seller_steam_api_key = member.steam_api_key;
                    const seller_data:any = await get_trade_offers(seller_steam_api_key, true);
    
                    const buyer_id = order.buyer_id;
                    const buyer = await members.findOne({steamId:buyer_id});
                    const buyer_steam_api_key = buyer?.steam_api_key;
    
                    const buyer_data:any = await get_trade_offers(buyer_steam_api_key, false);
    
                    const items_to_give = seller_data.trade_offers.find((order:any)=> order.pure_id === buyer_id).items_to_give;
                    const items_to_receive = buyer_data.trade_offers.find((order:any)=> order.pure_id === seller_id).items_to_receive;

                    const to_be_given = items_to_give.find((e:any)=>e.assetid === order_assetid);
                    const to_be_received = items_to_receive.find((e:any)=>e.assetid === order_assetid);
                    
                    console.log(appId)
                    console.log(items_to_give);
                    console.log(items_to_receive);


                    if(to_be_given && to_be_received && _.isEqual(to_be_given,to_be_received)){
                      console.log("Trade status e bakılabilir");
                      const seller_trade_state = seller_data.trade_offers.find((order:any)=> order.pure_id === buyer_id).trade_offer_state;
                      const buyer_trade_state = buyer_data.trade_offers.find((order:any)=> order.pure_id === seller_id).trade_offer_state;
                      if(seller_trade_state === 2 && buyer_trade_state === 2){
                        console.log("Sender fulfilled: Buyer did not accept");

                        const response_seller = await members.updateOne(
                          {
                            steamId: seller_id,
                            they_ordered: {
                              $elemMatch: {
                                sellerId: seller_id,
                                buyer_id: buyer_id,
                                assetid: order.assetid,
                                when:order.when
                              }
                            }
                          },
                          {
                            $set: {
                              "they_ordered.$.status": "Failed"
                            }
                          }
                        );                          

                        const response_buyer = await members.updateOne(
                          {
                            steamId: buyer_id,
                            I_ordered: {
                              $elemMatch: {
                                sellerId: seller_id,
                                buyer_id: buyer_id,
                                assetid: order.assetid,
                                when:order.when
                              }
                            }
                          },
                          {
                            $set: {
                              "I_ordered.$.status": "Failed",
                            },
                          }
                        );
                        console.log(response_seller.modifiedCount,response_buyer.modifiedCount,"Failed trade");

                      }
                      if(seller_trade_state === 3 && buyer_trade_state === 3){
                        console.log("3-3 devam edilebilir");
                        let seller_inventory_new = await fetch_new_inventory(seller_id,seller_steam_api_key,appId);
                        const seller_inventory_old = seller?.[`descriptions_${appId}`];

                        const buyer_inventory_new = await fetch_new_inventory(buyer_id,buyer_steam_api_key,appId);
                        const buyer_inventory_old = buyer?.[`descriptions_${appId}`];

                        //transferring existing prices from old inventory in game bazaar
                        //match according to market_hash_name
                        if(buyer_inventory_old){
                          buyer_inventory_old.forEach((old_item:any) => {
                            buyer_inventory_new.forEach((new_item:any) => {
                                if(old_item.assetid === new_item.assetid){
                                    new_item.price = old_item.price
                                }else{
                                  new_item.price = 0
                                }
                            });
                          });
                        }

                        //transferring existing prices from old inventory in game bazaar
                        seller_inventory_old.forEach((old_element:any) => {
                          if(old_element.assetid === order_assetid){
                              old_element.price = 0;
                              //buyer_inventory_new.push(old_element);
                          }
                            if(seller_inventory_new){
                              seller_inventory_new.forEach((new_element:any) => {
                                if(old_element.assetid === new_element.assetid)
                                {
                                    new_element.price = old_element.price
                                }
                              });
                            }
                            else{
                              console.log("No new inventory for the seller!");
                              seller_inventory_new = [];
                            }
                          });

                          console.log(seller_inventory_old.length);
                          console.log(seller_inventory_new.length);
  
                          console.log(buyer_inventory_old.length);
                          console.log(buyer_inventory_new.length);


                          const response_seller = await members.updateOne(
                            {
                              steamId: seller_id,
                              they_ordered: {
                                $elemMatch: {
                                  sellerId: seller_id,
                                  buyer_id: buyer_id,
                                  assetid: order.assetid,
                                  when:order.when
                                }
                              }
                            },
                            {
                              $set: {
                                "they_ordered.$.status": "Completed",
                                "they_ordered.$.transaction_closed_at": new Date(),
                                [`descriptions_${appId}`]:seller_inventory_new,
                                [`last_updated_${appId}`]:new Date()
                              },
                              $inc: {
                                "balance": price,
                              },
                            }
                          );
  
                          const response_buyer = await members.updateOne(
                            {
                              steamId: buyer_id,
                              I_ordered: {
                                $elemMatch: {
                                  sellerId: seller_id,
                                  buyer_id: buyer_id,
                                  assetid: order.assetid,
                                  when:order.when
                                }
                              }
                            },
                            {
                              $set: {
                                "I_ordered.$.status": "Completed",
                                "I_ordered.$.transaction_closed_at": new Date(),
                                [`descriptions_${appId}`]:buyer_inventory_new,
                                [`last_updated_${appId}`]:new Date()
                              },
                              $inc: {
                                "balance": -price,
                              },
                            }
                          );
  
                         console.log(response_seller.modifiedCount, response_buyer.modifiedCount,"Bingo, go check balances") 


                      }

                      console.log(seller_trade_state,buyer_trade_state)
                    }

                    //Olumlu trade ancak to_be_given undefined
                    if(to_be_received && !to_be_given){
                      const buyer_trade_state = buyer_data.trade_offers.find((order:any)=> order.pure_id === seller_id).trade_offer_state;
                      //const seller_trade_state = seller_data.trade_offers.find((order:any)=> order.pure_id === buyer_id).trade_offer_state;
                      if(buyer_trade_state === 3){
                        console.log("3-3 devam edilebilir");
                        let seller_inventory_new = await fetch_new_inventory(seller_id,seller_steam_api_key,appId);
                        const seller_inventory_old = seller?.[`descriptions_${appId}`];

                        const buyer_inventory_new = await fetch_new_inventory(buyer_id,buyer_steam_api_key,appId);
                        const buyer_inventory_old = buyer?.[`descriptions_${appId}`];

                        //transferring existing prices from old inventory in game bazaar
                        //match according to market_hash_name
                        if(buyer_inventory_old){
                          buyer_inventory_old.forEach((old_item:any) => {
                            buyer_inventory_new.forEach((new_item:any) => {
                                if(old_item.assetid === new_item.assetid){
                                    new_item.price = old_item.price
                                }else{
                                  new_item.price = 0
                                }
                            });
                          });
                        }

                        //transferring existing prices from old inventory in game bazaar
                        seller_inventory_old.forEach((old_element:any) => {
                          if(old_element.assetid === order_assetid){
                              old_element.price = 0;
                              //buyer_inventory_new.push(old_element);
                          }
                            if(seller_inventory_new){
                              seller_inventory_new.forEach((new_element:any) => {
                                if(old_element.assetid === new_element.assetid)
                                {
                                    new_element.price = old_element.price
                                }
                              });
                            }
                            else{
                              console.log("No new inventory for the seller!");
                              seller_inventory_new = [];
                            }
                          });

                          console.log(seller_inventory_old.length);
                          console.log(seller_inventory_new.length);
  
                          console.log(buyer_inventory_old.length);
                          console.log(buyer_inventory_new.length);


                          const response_seller = await members.updateOne(
                            {
                              steamId: seller_id,
                              they_ordered: {
                                $elemMatch: {
                                  sellerId: seller_id,
                                  buyer_id: buyer_id,
                                  assetid: order.assetid,
                                  when:order.when
                                }
                              }
                            },
                            {
                              $set: {
                                "they_ordered.$.status": "Completed",
                                "they_ordered.$.transaction_closed_at": new Date(),
                                [`descriptions_${appId}`]:seller_inventory_new,
                                [`last_updated_${appId}`]:new Date()
                              },
                              $inc: {
                                "balance": price,
                              },
                            }
                          );
  
                          const response_buyer = await members.updateOne(
                            {
                              steamId: buyer_id,
                              I_ordered: {
                                $elemMatch: {
                                  sellerId: seller_id,
                                  buyer_id: buyer_id,
                                  assetid: order.assetid,
                                  when:order.when
                                }
                              }
                            },
                            {
                              $set: {
                                "I_ordered.$.status": "Completed",
                                "I_ordered.$.transaction_closed_at": new Date(),
                                [`descriptions_${appId}`]:buyer_inventory_new,
                                [`last_updated_${appId}`]:new Date()
                              },
                              $inc: {
                                "balance": -price,
                              },
                            }
                          );
  
                         console.log(response_seller.modifiedCount, response_buyer.modifiedCount,"Bingo, go check balances") 


                      }
                      
                    }

                    //Olumsuz sonuç
/*                     if(!to_be_given){
                        console.log("Gönderici Göndermedi");
                        //console.log(order_assetid, seller_id, buyer_id)
                        console.log(seller_id, buyer_id, order_assetid, order.when)
                        const response_seller = await members.updateOne(
                            {
                              steamId: seller_id,
                              they_ordered: {
                                $elemMatch: {
                                  sellerId: seller_id,
                                  buyer_id: buyer_id,
                                  assetid: order.assetid,
                                  when:order.when
                                }
                              }
                            },
                            {
                              $set: {
                                "they_ordered.$.status": "Failed",
                                "they_ordered.$.transaction_closed_at": new Date(),
                              }
                            }
                          );                          

                          const response_buyer = await members.updateOne(
                            {
                              steamId: buyer_id,
                              I_ordered: {
                                $elemMatch: {
                                  sellerId: seller_id,
                                  buyer_id: buyer_id,
                                  assetid: order.assetid,
                                  when:order.when
                                }
                              }
                            },
                            {
                              $set: {
                                "I_ordered.$.status": "Failed",
                                "I_ordered.$.transaction_closed_at": new Date(),
                              },
                            }
                          );
                          console.log(response_seller.modifiedCount,response_buyer.modifiedCount,"Failed trade");
                    } */

                }
                else{
                    //console.log(order.status)
                }
            }
        }
        res.status(200).json({message:"Trades object received"})
    }        
    catch(err){
        console.log(err);
        res.status(200).json({message:err})
    }
}
