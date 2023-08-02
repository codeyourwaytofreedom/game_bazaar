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
  console.log(req.body);

  const client = await connectToDatabase();
  const data_base = client.db('business');
  const coll = data_base.collection('comments');
  coll.insertOne({
    comment:req.body,
    });
      
  res.status(200).send('OK');
}
