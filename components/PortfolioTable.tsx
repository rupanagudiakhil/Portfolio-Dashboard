import { useEffect, useState } from 'react';
import { StockData } from '../types/portfolio';
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
];

export default function PortfolioTable() {
  const [data, setData] = useState<StockData[]>(MOCK_PORTFOLIO);

  const updateData = async () => {
    const updated = await Promise.all(
      data.map(async (stock) => {
        const [cmpRes, googleRes] = await Promise.all([
          fetch(`/api/yahoo?symbol=${stock.stockName}`).then(res => res.json()),
          fetch(`/api/google?symbol=${stock.stockGoogle}`).then(res => res.json()),
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
  };

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-2">Stock</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Purchase Price</th>
            <th className="p-2">Investment</th>
            <th className="p-2">CMP</th>
            <th className="p-2">Present Value</th>
            <th className="p-2">Gain/Loss</th>
            <th className="p-2">P/E</th>
            <th className="p-2">Earnings</th>
          </tr>
        </thead>
        <tbody>
          {data.map((stock) => {
            const investment = stock.quantity * stock.purchasePrice;
            const presentValue = (stock.cmp ?? 0) * stock.quantity;
            const gainLoss = presentValue - investment;
            const gainLossClass = classNames('p-2', {
              'text-green-600': gainLoss > 0,
              'text-red-600': gainLoss < 0,
            });

            return (
              <tr key={stock.stockName} className="border-t">
                <td className="p-2">{stock.stockName}</td>
                <td className="p-2">{stock.quantity}</td>
                <td className="p-2">{stock.purchasePrice}</td>
                <td className="p-2">{investment.toFixed(2)}</td>
                <td className="p-2">{stock.cmp?.toFixed(2)}</td>
                <td className="p-2">{presentValue.toFixed(2)}</td>
                <td className={gainLossClass}>{gainLoss.toFixed(2)}</td>
                <td className="p-2">{stock.peRatio}</td>
                <td className="p-2">{stock.latestEarnings}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
