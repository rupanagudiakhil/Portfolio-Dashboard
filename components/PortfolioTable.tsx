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
    logourl: '/logos/tcs.png',
  },
  {
    stockName: 'INFY.NS',
    stockGoogle: 'INFY',
    purchasePrice: 1500,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Technology',
    logourl: 'logos/infosys.png',
  },
  {
    stockName: 'HDFCBANK.NS',
    stockGoogle: 'HDFCBANK',
    purchasePrice: 1500,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Financials',
    logourl: 'logos/hdfc_bank.png',
  },
  {
    stockName: 'ICICIBANK.NS',
    stockGoogle: 'ICICIBANK',
    purchasePrice: 1500,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Financials',
    logourl: 'logos/icici_bank.png',
  },
  {
    stockName: 'WIPRO.NS',
    stockGoogle: 'WIPRO',
    purchasePrice: 247,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Technology',
    logourl: 'logos/wipro.png'
  },
  {
    stockName: 'SBIN.NS',
    stockGoogle: 'SBIN',
    purchasePrice: 790,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Financials',
    logourl: 'logos/state_bank_of_india.png'
  },
  {
    stockName: 'YESBANK.NS',
    stockGoogle: 'YESBANK',
    purchasePrice: 21,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Financials',
    logourl: 'logos/yes_bank.png'
  },
  {
    stockName: 'RELIANCE.NS',
    stockGoogle: 'RELIANCE',
    purchasePrice: 1426,
    quantity: 10,
    exchange: 'NSE',
    sector: 'Industrial',
    logourl: 'logos/reliance_industries.png'
  },
  {
    stockName: 'TATAMOTORS.NS',
    stockGoogle: 'TATAMOTORS',
    purchasePrice: 718,
    quantity: 20,
    exchange: 'NSE',
    sector: 'Automotive',
    logourl: 'logos/tata_motors.png'
  }
];

function getSectorSummary(data: StockData[]) {
  const summary: Record<string, { investment: number; currentValue: number }> = {};

  data.forEach((stock) => {
    const investment = stock.quantity * stock.purchasePrice;
    const currentValue = (stock.cmp ?? 0) * stock.quantity;

    if (!summary[stock.sector]) {
      summary[stock.sector] = { investment: 0, currentValue: 0 };
    }

    summary[stock.sector].investment += investment;
    summary[stock.sector].currentValue += currentValue;
  });

  return Object.entries(summary).map(([sector, { investment, currentValue }]) => ({
    sector,
    investment,
    currentValue,
    gainLoss: currentValue - investment,
  }));
}

function getTopMovers(data: StockData[], count = 5) {
  const sorted = [...data]
    .filter(stock => stock.cmp !== undefined)
    .map(stock => ({
      ...stock,
      gainLoss: (stock.cmp! * stock.quantity) - (stock.purchasePrice * stock.quantity),
    }))
    .sort((a, b) => b.gainLoss - a.gainLoss);

  return {
    gainers: sorted.slice(0, count),
    losers: sorted.slice(-count).reverse()
  };
}

export default function PortfolioTable() {
  const [data, setData] = useState<StockData[]>(MOCK_PORTFOLIO);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredData = data.filter((stock) =>
    stock.stockName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { gainers, losers } = getTopMovers(data);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-gray-600 text-lg">Loading portfolio data...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search stock..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded p-2"
        />
      </div>

      {/* Portfolio Table */}
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
          {filteredData.map((stock) => {
            const investment = stock.quantity * stock.purchasePrice;
            const presentValue = (stock.cmp ?? 0) * stock.quantity;
            const gainLoss = presentValue - investment;
            const gainLossClass = classNames('p-2 border text-sm border-black', {
              'text-green-600': gainLoss > 0,
              'text-red-600': gainLoss < 0,
            });

            return (
              <tr key={stock.stockName} className="border-t">
                <td className="p-2 border">
                  <div className="flex items-center gap-2">
                    <img
                      src={stock.logourl}
                      alt={stock.stockName}
                      className="w-6 h-6 object-contain"
                    />
                    <span>{stock.stockName}</span>
                  </div>
                </td>
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

      {/* Sector Pie + Sector Table */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Sector Distribution</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 w-full">
          <SectorPieChart data={data} />
        </div>
        <div className="lg:w-1/2 w-full overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-green-200 text-left">
              <tr>
                <th className="p-2 border">Sector</th>
                <th className="p-2 border">Total Investment</th>
                <th className="p-2 border">Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {getSectorSummary(data).map(({ sector, investment, gainLoss }) => (
                <tr key={sector}>
                  <td className="p-2 border">{sector}</td>
                  <td className="p-2 border">₹{investment.toFixed(2)}</td>
                  <td className={classNames("p-2 border", {
                    "text-green-600": gainLoss > 0,
                    "text-red-600": gainLoss < 0,
                  })}>
                    ₹{gainLoss.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Gainers and Losers */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold mb-2 text-green-600 flex items-center">
            Top 5 Gainers
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7M12 3v18" />
            </svg>
          </h3>
          <ul className="space-y-1">
            {gainers.map(stock => (
              <li key={stock.stockName} className="border p-2 rounded bg-green-50">
                <span className="font-semibold">{stock.stockName}</span>: ₹{stock.gainLoss.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2 text-red-600">Top 5 Losers
            <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5 ml-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7M12 21V3" />
                    </svg>
          </h3>

          <ul className="space-y-1">
            {losers.map(stock => (
              <li key={stock.stockName} className="border p-2 rounded bg-red-50">
                <span className="font-semibold">{stock.stockName}</span>: ₹{stock.gainLoss.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
