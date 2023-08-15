import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient} from "mongodb";

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MD_URL!);
  return client;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("ins accessed")
    const referringURL = req.headers.referer;
    const queryParams = new URLSearchParams(referringURL);
    const steamID = queryParams.get('openid.identity');

    const client = await connectToDatabase();
    const data_base = client.db('game-bazaar');
    const members = data_base.collection('members');

    if(steamID){
      const splitted = steamID?.split("/");
      const id = splitted[splitted.length-1];
      const existingUser = await members.findOne({ steamId: id });

      if(existingUser){
        console.log("Mevcut user dan devam etti")
        const url = existingUser.profile_img_url;
        const balance = existingUser.balance;
        const id = existingUser.steamId;

        res.setHeader('Set-Cookie', `ID=${id}; HttpOnly; Max-Age=${60 * 60}; Path=/; Secure`);
        res.status(200).json({url:url,id:id, balance:balance});
      }
      else{
        console.log("0 dan ekledi")
        const apiUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM}&steamids=${id}`;
        await fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                if (
                data.response &&
                data.response.players &&
                data.response.players.length > 0 &&
                data.response.players[0].avatarfull
                ) {
                const profileImage = data.response.players[0].avatarfull;

                  members.updateOne(
                  { steamId: id },
                  { $setOnInsert: { 
                      steamId: id, 
                      profile_img_url:profileImage,
                      date_joined: new Date(),
                      balance:0,
                      steam_api_key:"keykey",
                      game_bazaar_api_key:"...."
                    } }, 
                  { upsert: true }
                );

                res.setHeader('Set-Cookie', `ID=${steamID}; HttpOnly; Max-Age=${60 * 60}; Path=/; Secure`);
                res.status(200).json({url:profileImage,id:steamID, balance:0});
                } else {
                console.log('Profile image not found');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
      }
    }

    else{
        res.status(403).json({ error: 'Unauthorized' });
    }
}

