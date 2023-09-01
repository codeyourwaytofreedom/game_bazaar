import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("Fast api test route")
    try{        
        const response = await fetch('https://rotator-delta.vercel.app/api/python?key=victoria&id=66_88');
        const status = response.status;

        if(status === 200){
            const resJson = await response.json();
            console.log(resJson.key, resJson.id);
            res.status(200).json({message:status})
        }

    }
    catch(err){
        console.log(err)
    }
}
