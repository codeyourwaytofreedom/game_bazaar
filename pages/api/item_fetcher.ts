import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    const {appid, classid} = req.query;

    if(appid && classid){
        console.log("Parametera available");

        const client = await connectToDatabase();
        const data_base = client.db('game-bazaar');
        const members = data_base.collection('members');

          const result = await members.aggregate([
            {
              $project: {
                _id: 0,
                steamId:1,
                filteredDescriptions: {
                  $filter: {
                    input: `$descriptions_${appid}`,
                    as: 'description',
                    cond: { $eq: ['$$description.classid', classid] }
                  }
                },
                delivery_time: 1
              }
            }
          ]).toArray();

          if(result){
            res.status(200).json(result)
          }
          else{
            res.status(404).json({message:"Matching items could not be fetched..."})
          }
    }
    else{
        res.status(404).json({message:"Item parameters missing !!!"})
    }
}