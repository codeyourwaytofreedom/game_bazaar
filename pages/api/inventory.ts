import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";
import { fetch_new_inventory } from '../../tools';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    console.log("inventory api endpoint accessed");
    const idCookie = req.cookies.ID;
    let steamID;

    if(idCookie){
        const isSteamOpenIDURL = idCookie.includes("https://steamcommunity.com/openid/id/");
        if(isSteamOpenIDURL){
            const parts = idCookie.split("/");
            steamID = parts[parts.length - 1];
        }
        else {
            steamID = idCookie;
        }
    }

    if(!steamID){
        res.status(401).json({message:"Login Required to get inventory !!!"})
    }

    else{
        const client = await connectToDatabase();
        const data_base = client.db('game-bazaar');
        const members = data_base.collection('members');

        const appId = req.query.game === "csgo" ? "730" : '440';

        const existingUser = await members.findOne({steamId:steamID});

        if(existingUser){
            const existing_inventory = existingUser[`descriptions_${appId}`];
            if(!existing_inventory){
                //console.log(existingUser.steam_api_key);
                try {
                    //Localhost for testing
                    //const rotated_url = `https://markt.tf/inventory/${process.env.ID}/${existingUser.steam_api_key}/${appId}`;

                    // Production version
                    const rotated_url = `https://markt.tf/inventory/${steamID}/${existingUser.steam_api_key}/${appId}`;
                    const response = await fetch(rotated_url);
                    
                    const restext = await response.json();
                    const data = JSON.parse(restext);

                    const descriptions = data.response.descriptions;
                    const assets = data.response.assets;
                    console.log("hereeeeeeeee")


                    assets.forEach((asset:any,assetInd:any) => {
                        descriptions.forEach((desc:any, descInd:any) => {
                            //console.log(asset.classid === desc.classid, asset.instanceid === desc.instanceid);
                            if(asset.classid === desc.classid && asset.instanceid === desc.instanceid){
                                descriptions[descInd].assetid = asset.assetid
                            }
                        });
                    });

                    if(descriptions){
                        const descriptions_with_prices = descriptions.map((game_item:any) => {return {...game_item, price:0}})
                        await members.updateOne(
                            { steamId: steamID },
                            { $set: { 
                                [`descriptions_${appId}`]: descriptions_with_prices,
                                [`last_updated_${appId}`]:new Date() 
                                } 
                            }
                          );
                        res.status(200).json(descriptions_with_prices);
                    }
                    else{
                        res.status(404).json({message:"descriptions yok"})
                    }
            
                } catch (error) {
                    console.error("Error:", error);
                    res.status(500).json({message:"inventory getirilemedi..."});
                } 
            }
            else{
                // Existing inventory
                const last_updated = existingUser[`last_updated_${appId}`];

                const difference = (new Date().getTime() - new Date(last_updated).getTime())/1000;
                const refresh_time = 30*60;
                console.log(difference);
                
                if(difference > refresh_time){
                    console.log("Time to update inventory for this category");

                    const new_inventory = await fetch_new_inventory(steamID,existingUser.steam_api_key,appId);
                    const old_intenvory = existingUser[`descriptions_${appId}`];

                    

                    //Localhost for testing
                    //const new_inventory = await fetch_new_inventory(process.env.ID!,existingUser.steam_api_key,parseInt(appId));
                    

                    //transferring existing prices to new inventory
                    old_intenvory.forEach((old_element:any) => {
                        new_inventory.forEach((new_element:any) => {
                            if(old_element.assetid === new_element.assetid){
                                new_element.price = old_element.price;
                            }
                        });
                    });

                    console.log(new_inventory)
                    
                    const result = await members.updateOne(
                        { steamId: steamID },
                        { $set: { 
                            [`descriptions_${appId}`]: new_inventory,
                            [`last_updated_${appId}`]:new Date() 
                            } 
                        }
                      );
                    console.log(result.modifiedCount);
                    res.status(200).json(new_inventory)
                }else{
                    console.log("No need to update inventory")
                    res.status(200).json(existingUser[`descriptions_${appId}`])
                }
            }
        }
        else{
            res.status(404).json({message:steamID})
        }
    }
}