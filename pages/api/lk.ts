import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("Link to be verified");
    console.log(req.body);

    if(req.body){
        const queryString = req.body.split('?')[1];
        const parsedParams = new URLSearchParams(queryString);
    
        const partner = parsedParams.get('partner');
        const token = parsedParams.get('token');

        if(partner && token){
            console.log(partner,token);
            res.status(200).send('OK');
        }
        else{
            console.log("req body available but not valid link")
            res.status(404).send('null');
        }   
    }
}