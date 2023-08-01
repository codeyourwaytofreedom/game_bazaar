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
  const data_base = client.db('magic_cursor');
  const coll = data_base.collection('Cursor_sets');
  coll.insertOne({
    comment:"Yorum burada",
    });
      
  res.status(200).send('OK');
}
