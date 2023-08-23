
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';


const cors = Cors({
    allowMethods: ['POST', 'HEAD'],
  });
  
cors(handler as any);


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        console.log(resjson)
        res.send("ok");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
