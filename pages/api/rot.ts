import { NextApiRequest, NextApiResponse } from 'next';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //With proxy agent
    const agent = new HttpsProxyAgent('http://200.105.215.22:33630');
    try {
        const response = await fetch('http://httpbin.org/ip', { agent });
        const body = await response.text();
        console.log(body);
    } catch (error) {
        //console.log('error', error);
    }

    //without proxy agent
    try {
        const response = await fetch('http://httpbin.org/ip');
        const body = await response.text();
        console.log(body);
    } catch (error) {
        //console.log('error', error);
    }

  res.send("OK")
}
