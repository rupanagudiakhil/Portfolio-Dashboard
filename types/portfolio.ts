export interface StockData {
    stockName: string;
    stockGoogle: string;
    purchasePrice: number;
    quantity: number;
    exchange: 'NSE' | 'BSE';
    sector: string;
    cmp?: number;
    peRatio?: number;
    latestEarnings?: number;
    logourl?:string;
  }
  