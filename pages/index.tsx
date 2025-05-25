import Head from 'next/head';
import PortfolioTable from '../components/PortfolioTable';
import SectorPieChart from '../components/SectorPieChart';

export default function Home() {

  return (
    <>
      <Head>
        <title>Portfolio Dashboard</title>
      </Head>
      <main className="p-4">
        <div className="flex items-center space-x-3 py-4 px-6 bg-blue-100 rounded shadow-md">
          {/* Portfolio Icon (e.g., Pie Chart) */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V3a9 9 0 019 9h-8zM21 12A9 9 0 113 12a9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-800">Portfolio Dashboard</h1>
        </div>

        <PortfolioTable />
        
      </main>
    </>
  );
}
