import Head from 'next/head';
import PortfolioTable from '../components/PortfolioTable';

export default function Home() {

  return (
    <>
      <Head>
        <title>Portfolio Dashboard</title>
      </Head>
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dynamic Portfolio Dashboard</h1>
        <PortfolioTable />
      </main>
    </>
  );
}
