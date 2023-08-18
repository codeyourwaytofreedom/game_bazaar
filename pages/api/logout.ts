import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("Log out request received");
    // Set Cache-Control header to prevent caching
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Set-Cookie', 'ID=; HttpOnly; Max-Age=0; Path=/; Secure; SameSite=None');
    res.status(200).send('OK');

}