/* import type { NextApiRequest, NextApiResponse } from 'next';
import { Issuer } from 'openid-client';



const authenticateWithSteam = async () => {
    try {
      const steamIssuer = await Issuer.discover('https://steamcommunity.com/openid');
      const client = new steamIssuer.Client({
        client_id: process.env.STEAM_API_KEY, // Use the .env variable here
        redirect_uris: [`${process.env.BASE_URL}/api/login/callback`], // Use the .env variable here
      });
  
      const url = client.authorizationUrl({
        scope: 'openid',
        redirect_uri: `${process.env.BASE_URL}/api/login/callback`, // Use the .env variable here
      });
  
      // Open Steam authentication in a new window or popup
      window.open(url, 'steamLoginWindow', 'width=800,height=600');
    } catch (error) {
      console.error('Steam authentication error:', error);
    }
  };


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // Call the authentication function
    authenticateWithSteam();

    // Respond with some message or status if needed
    res.status(200).json({ message: 'Steam authentication started.' });
} */