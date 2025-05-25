import { useEffect, useState } from 'react';
import { StockData } from '../types/portfolio';
import SectorPieChart from './SectorPieChart';
import classNames from 'classnames';

const MOCK_PORTFOLIO: StockData[] = [
  {
    stockName: 'TCS.NS',
    stockGoogle: 'TCS',
    purchasePrice: 3000,
    quantity: 10,
    exchange: 'NSE',
    sector: 'Technology',
  },
  {
    stockName: 'INFY.NS',
    stockGoogle: 'INFY',
    purchasePrice: 1500,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Technology',
  },
  {
    stockName: 'HDFCBANK.NS',
    stockGoogle: 'HDFCBANK',
    purchasePrice: 1500,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Financials',
  },
  {
    stockName: 'ICICIBANK.NS',
    stockGoogle: 'ICICIBANK',
    purchasePrice: 1500,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Financials',
  },
  {
    stockName: 'WIPRO.NS',
    stockGoogle: 'WIPRO',
    purchasePrice: 247,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Technology',
  },
  {
    stockName: 'SBIN.NS',
    stockGoogle: 'SBIN',
    purchasePrice: 790,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Financials',
  },
  {
    stockName: 'YESBANK.NS',
    stockGoogle: 'YESBANK',
    purchasePrice: 21,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Financials',
  },
  {
    stockName: 'RELIANCE.NS',
    stockGoogle: 'RELIANCE',
    purchasePrice: 1426,
    quantity: 10,
    exchange: 'NSE',
    sector: 'Industrial',
  },
  {
    stockName: 'TATAMOTORS.NS',
    stockGoogle: 'TATAMOTORS',
    purchasePrice: 718,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Automotive',
  }
  /*
    {
    stockName: 'BRITANNIA.NS',
    stockGoogle: 'BRITANNIA',
    purchasePrice: 5486,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Industrial',
  },
  {
    stockName: 'HINDUNILVR.NS',
    stockGoogle: 'HINDUNILVR',
    purchasePrice: 2359,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Industrial',
  },
  {
    stockName: 'TATAPOWER.NS',
    stockGoogle: 'TATAPOWER',
    purchasePrice: 401,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Energy',
  },
  {
    stockName: 'ADANIGREEN.NS',
    stockGoogle: 'ADANIGREEN',
    purchasePrice: 986,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Energy',
  },
  {
    stockName: 'EICHERMOT.NS',
    stockGoogle: 'EICHERMOT',
    purchasePrice: 5390,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Automotive',
  } */
];

export default function PortfolioTable() {
  const [data, setData] = useState<StockData[]>(MOCK_PORTFOLIO);
  const [loading, setLoading] = useState(true);

  const updateData = async () => {
    try {
      const updated = await Promise.all(
        data.map(async (stock) => {
          const [cmpRes, googleRes] = await Promise.all([
            fetch(`/api/yahoo?symbol=${stock.stockName}`).then((res) => res.json()),
            fetch(`/api/google?symbol=${stock.stockGoogle}`).then((res) => res.json()),
          ]);

          return {
            ...stock,
            cmp: cmpRes.cmp,
            peRatio: googleRes.peRatio,
            latestEarnings: googleRes.earnings,
          };
        })
      );
      setData(updated);
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-gray-600 text-lg">Loading portfolio data...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* <table className="min-w-full border text-sm"> */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-blue-200 text-left">
          <tr>
            <th className="p-2 border-1">Stock</th>
            <th className="p-2 border-1">Qty</th>
            <th className="p-2 border-1">Purchase Price</th>
            <th className="p-2 border-1">Investment</th>
            <th className="p-2 border-1">CMP</th>
            <th className="p-2 border-1">Present Value</th>
            <th className="p-2 border-1">Gain/Loss</th>
            <th className="p-2 border-1">P/E</th>
            <th className="p-2 border-1">Earnings</th>
          </tr>
        </thead>
        <tbody>
          {data.map((stock) => {
            const investment = stock.quantity * stock.purchasePrice;
            const presentValue = (stock.cmp ?? 0) * stock.quantity;
            const gainLoss = presentValue - investment;
            const gainLossClass = classNames('p-2 border-1  border-black', {
              'text-green-600': gainLoss > 0,
              'text-red-600': gainLoss < 0,
            });

            return (
              <tr key={stock.stockName} className="border-t">
                <td className="p-2 border-1">{stock.stockName}</td>
                <td className="p-2 border-1">{stock.quantity}</td>
                <td className="p-2 border-1">{stock.purchasePrice}</td>
                <td className="p-2 border-1">{investment.toFixed(2)}</td>
                <td className="p-2 border-1">{stock.cmp?.toFixed(2)}</td>
                <td className="p-2 border-1">{presentValue.toFixed(2)}</td>
                {/* <td className={gainLossClass}>{gainLoss.toFixed(2)}
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7 7 7M12 3v18" />
</svg>
</td> */}
                <td className={gainLossClass}>
                  {gainLoss.toFixed(2)}
                  {gainLoss > 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5 ml-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7M12 3v18" />
                    </svg>
                  )}
                  {gainLoss < 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5 ml-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7M12 21V3" />
                    </svg>
                  )}
                </td>

                <td className="p-2 border-1">{stock.peRatio}</td>
                <td className="p-2 border-1">{stock.latestEarnings}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <SectorPieChart data={data} />
    </div>
  );
}
