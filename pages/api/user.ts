import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    console.log("User fetching api endpoint accessed");

    const client = await connectToDatabase();
    const data_base = client.db('game-bazaar');
    const members = data_base.collection('members');

    const steamID = req.cookies.ID;
    const existingUser = await members.findOne({steamId:steamID});

    if (existingUser) {
        console.log(existingUser.balance);
        const profile_details = {
            id: existingUser.steamId,
            balance: existingUser.balance,
            email:existingUser.email,
            delivery: existingUser.delivery_time,
            game_bazaar_api_key: existingUser.game_bazaar_api_key
        }
        res.status(200).json(profile_details);
    }
    else{
        res.status(404).send("User not found !!!");
    }
}
