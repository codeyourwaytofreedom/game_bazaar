import type { NextApiRequest, NextApiResponse } from 'next';
import passport from './passport-config';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  passport.authenticate('steam', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json({ message: 'Authentication successful', user });
  })(req, res);
}
