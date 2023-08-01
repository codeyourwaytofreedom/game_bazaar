import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient} from "mongodb";

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MD_URL!);
  return client;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const client = await connectToDatabase();
  const data_base = client.db('business');
  const coll = data_base.collection('comments');
  coll.insertOne({
    comment:"Eklenen yorum ",
    });
      
  res.status(200).send('OK');
}
