export async function fetchGoogleFinanceData(symbol: string): Promise<{ peRatio: number; earnings: number } | null> {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzxdrqY184y74HJVqy68bM5ZapWIRnXUYprUc4vqzffOdJUNoRruaSX2sC_VH_PTjrD5Q/exec');
    const stockData = await response.json();

    const matched = stockData.find((stock: any) => stock.stockName.toLowerCase() === symbol.toLowerCase());

    if (matched) {
      return {
        peRatio: matched.peRatio,
        earnings: matched.eps
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
