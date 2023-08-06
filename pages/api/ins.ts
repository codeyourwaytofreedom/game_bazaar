import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("request received")
    const referringURL = req.headers.referer;
    const queryParams = new URLSearchParams(referringURL);
    const steamID = queryParams.get('openid.identity');

    if(steamID){
        const splitted = steamID?.split("/");
        const id = splitted[splitted.length-1];
        console.log(id);

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
                console.log('User Profile Image URL:', profileImage);
                res.setHeader('Set-Cookie', `ID=${steamID}; HttpOnly; Max-Age=${60 * 60}; Path=/; Secure`);
                res.status(200).json({url:profileImage});
                } else {
                console.log('Profile image not found');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    else{
        res.status(403).json({ error: 'Unauthorized' });
    }
}

