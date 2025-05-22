import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGoogleFinanceData } from '../../lib/googleFinance';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { symbol } = req.query;
  const data = await fetchGoogleFinanceData(symbol as string);
  res.status(200).json(data);
};
