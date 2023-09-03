import type { NextApiRequest, NextApiResponse } from 'next';
import cron from 'node-cron';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log("Hello Cron")
    cron.schedule('*/5 * * * * *', () => {
        console.log('Cron job is running every 5 seconds.');
    });
}
