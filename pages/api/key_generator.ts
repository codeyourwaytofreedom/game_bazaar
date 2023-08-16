import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";
import crypto from 'crypto';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    console.log("Key generator api endpoint accessed");

/*     const client = await connectToDatabase();
    const database = client.db('game-bazaar');
    const members = database.collection('members'); */

    const steamID = req.cookies.ID;
    console.log(steamID);
    //const existingUser = await members.findOne({ steamId: steamID });


    //-	“/profile” sayfasında API Key generate’lemek lazım (Kişinin steamID’si, oluşturduğu zaman, profil fotoğrafı hash’lenecek) 

    res.status(200).send("Route working")
}
