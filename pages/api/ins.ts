import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("request received")
    const referringURL = req.headers.referer;
    const queryParams = new URLSearchParams(referringURL);
    const steamID = queryParams.get('openid.identity');
    console.log(steamID)

    if(steamID){
        res.setHeader('Set-Cookie', `ID=${steamID}; HttpOnly; Max-Age=${60 * 60}; Path=/; Secure`);
        //res.setHeader('Set-Cookie', `in=true; Max-Age=${60 * 60}; Path=/; Secure`);
        res.status(200).send('OK');
    }
    else{
        res.status(403).json({ error: 'Unauthorized' });
    }
}

