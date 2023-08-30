import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

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
            console.log("direk id");
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
                try {
                    const url = `https://api.steampowered.com/IEconService/GetInventoryItemsWithDescriptions/v1/?key=${process.env.STEAM}&steamid=${process.env.ID}&appid=${appId}&contextid=2&get_descriptions=true`;
            
                    const response = await fetch(url);
                    const data = await response.json();
                    const descriptions = data.response.descriptions;
                    const assets = data.response.assets;

                    //console.log(descriptions.length, assets.length)

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
                            { $set: { [`descriptions_${appId}`]: descriptions_with_prices } }
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
                res.status(200).json(existingUser[`descriptions_${appId}`])
            }
        }
        else{
            res.status(404).json({message:steamID})
        }
    }
}