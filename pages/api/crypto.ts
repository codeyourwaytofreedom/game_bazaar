import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //console.log(req.body)
    try {
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
        console.log(resjson,response.status)
        res.send("ok");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}







/*     //With proxy agent
    const agent = new HttpsProxyAgent('http://144.49.99.18:8080');
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
    } */