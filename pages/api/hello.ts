// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

type Data = {
  notes: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const filePath = path.join(process.cwd(), 'notes.txt');
  const notes = fs.readFileSync(filePath, 'utf-8');

  fs.writeFileSync(filePath, notes + " " + new Date().toDateString(), 'utf-8');

  res.status(200).json({ notes:"notes" })
}
