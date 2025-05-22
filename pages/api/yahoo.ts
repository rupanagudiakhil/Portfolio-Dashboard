import { NextApiRequest, NextApiResponse } from 'next';
import { fetchYahooFinanceData } from '../../lib/yahooFinance';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { symbol } = req.query;
  const cmp = await fetchYahooFinanceData(symbol as string);
  res.status(200).json({ cmp });
};
