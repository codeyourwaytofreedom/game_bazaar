import type { NextApiRequest, NextApiResponse } from 'next';
import {connectToDatabase} from "./db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    const {appid, assetid} = req.query;
  
    if(appid && assetid){
        //console.log("Parameters available");
        const client = await connectToDatabase();
        const data_base = client.db('game-bazaar');
        const members = data_base.collection('members');

        const result = await members.aggregate([
          {
            $match: {
              [`descriptions_${appid}`]: { $exists: true, $ne: [] }, // Exclude members with missing or empty "descriptions" array
            },
          },
          {
            $project: {
              _id: 0,
              steamId: 1,
              filteredDescriptions: {
                $filter: {
                  input: `$descriptions_${appid}`,
                  as: 'description',
                  cond: { $eq: ['$$description.assetid', assetid] },
                },
              },
              delivery_time: 1,
            },
          },
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