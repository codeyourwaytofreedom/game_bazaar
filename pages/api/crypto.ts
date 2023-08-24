
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("Function started");
    const agent = new HttpsProxyAgent('http://144.49.99.18:8080');
    
    try {
        const response = await fetch('http://httpbin.org/ip', { agent });
        const body = await response.text();
        console.log(body);
    } catch (error) {
        console.log('error', error);
    }
    res.send("OK");

/*     try {
        const requestBody = new URLSearchParams();
        requestBody.append('test', 'false');
        requestBody.append('email', 'test@test.com');
        requestBody.append('name', 'name');
        requestBody.append('lastname', 'lastname');
        requestBody.append('amount', '10');
        requestBody.append('currency', 'BTC');
        requestBody.append('MerchantId', '0xMR9663343');
        requestBody.append('ClientId', '1000');
        requestBody.append('BillingId', '13304');
        requestBody.append('ReturnUrl', 'true');

        const response = await fetch('https://app.0xprocessing.com/Payment',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestBody.toString()
        });

        const resjson = await response.json();
        console.log(resjson)
        res.status(200).json(resjson);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    } */
}
