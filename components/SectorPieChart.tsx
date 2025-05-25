// components/SectorPieChart.tsx

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StockData } from '../types/portfolio'; // adjust import path as needed

type Props = {
  data: StockData[];
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

const SectorPieChart: React.FC<Props> = ({ data }) => {
  // Aggregate investment by sector
  const sectorData = data.reduce<{ name: string; value: number }[]>((acc, stock) => {
    const investment = stock.purchasePrice * stock.quantity;
    const existing = acc.find((s) => s.name === stock.sector);
    if (existing) {
      existing.value += investment;
    } else {
      acc.push({ name: stock.sector, value: investment });
    }
    return acc;
  }, []);

  return (
    <div className="w-full h-96 bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Investment by Sector</h2>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={sectorData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {sectorData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectorPieChart;
