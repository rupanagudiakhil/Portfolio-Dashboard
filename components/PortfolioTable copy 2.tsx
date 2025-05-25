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
];

function getSectorSummary(data: StockData[]) {
  const summary: Record<string, number> = {};

  data.forEach((stock) => {
    const investment = stock.quantity * stock.purchasePrice;
    summary[stock.sector] = (summary[stock.sector] || 0) + investment;
  });

  return Object.entries(summary).map(([sector, total]) => ({ sector, total }));
}

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
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-blue-200 text-left">
          <tr>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Purchase Price</th>
            <th className="p-2 border">Investment</th>
            <th className="p-2 border">CMP</th>
            <th className="p-2 border">Present Value</th>
            <th className="p-2 border">Gain/Loss</th>
            <th className="p-2 border">P/E</th>
            <th className="p-2 border">Earnings</th>
          </tr>
        </thead>
        <tbody>
          {data.map((stock) => {
            const investment = stock.quantity * stock.purchasePrice;
            const presentValue = (stock.cmp ?? 0) * stock.quantity;
            const gainLoss = presentValue - investment;
            const gainLossClass = classNames('p-2 border text-sm border-black', {
              'text-green-600': gainLoss > 0,
              'text-red-600': gainLoss < 0,
            });

            return (
              <tr key={stock.stockName} className="border-t">
                <td className="p-2 border">{stock.stockName}</td>
                <td className="p-2 border">{stock.quantity}</td>
                <td className="p-2 border">{stock.purchasePrice}</td>
                <td className="p-2 border">{investment.toFixed(2)}</td>
                <td className="p-2 border">{stock.cmp?.toFixed(2)}</td>
                <td className="p-2 border">{presentValue.toFixed(2)}</td>
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
                <td className="p-2 border">{stock.peRatio}</td>
                <td className="p-2 border">{stock.latestEarnings}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-10 mb-4">Sector Distribution</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Pie Chart */}
        <div className="lg:w-1/2 w-full">
          <SectorPieChart data={data} />
        </div>

        {/* Sector Table */}
        <div className="lg:w-1/2 w-full overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-green-200 text-left">
              <tr>
                <th className="p-2 border">Sector</th>
                <th className="p-2 border">Total Investment</th>
              </tr>
            </thead>
            <tbody>
              {getSectorSummary(data).map(({ sector, total }) => (
                <tr key={sector}>
                  <td className="p-2 border">{sector}</td>
                  <td className="p-2 border">{total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
