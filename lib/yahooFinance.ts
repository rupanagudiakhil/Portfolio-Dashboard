
import yahooFinance from 'yahoo-finance2';

export const fetchYahooFinanceData = async (symbol: string): Promise<number | null> => {
  try {
    const quote = await yahooFinance.quote(symbol);
    return quote.regularMarketPrice || null;
  } catch (err) {
    console.error(`Yahoo API error for ${symbol}:`, err);
    return null;
  }
};
