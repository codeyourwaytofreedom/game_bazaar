import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    console.log("Profile Info Update api endpoint accessed");

    const client = await connectToDatabase();
    const database = client.db('game-bazaar');
    const members = database.collection('members');

    const steamID = req.cookies.ID;
    const new_delivery_time = req.body;
    const existingUser = await members.findOne({ steamId: steamID });

    console.log(req.body)

    if (existingUser) {
        const updateData = {
            $set: { delivery_time: new_delivery_time }
        };

        const result = await members.updateOne({ _id: existingUser._id }, updateData);

        const updatedUser = await members.findOne({ steamId: steamID });
        if(updatedUser){
            const profile_details = {
                id: updatedUser.steamId,
                balance: updatedUser.balance,
                email:updatedUser.email,
                delivery: updatedUser.delivery_time
            }
            res.status(200).json(profile_details);
        }
        else{
            console.log("code works here")
        }

    } else {
        res.status(404).send("User not found !!!");
    }
}
