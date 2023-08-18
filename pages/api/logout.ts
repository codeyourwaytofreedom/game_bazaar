import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("Log out request received");

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
    console.log(steamID);

    if(steamID){
      res.setHeader('Set-Cookie', 'ID=""; HttpOnly; Max-Age=0; Path=/; Secure');
      res.status(200).send('OK');
    }
    else{
      res.setHeader('Set-Cookie', 'ID=""; HttpOnly; Max-Age=0; Path=/; Secure');
      res.status(200).send('OK');
    }
}