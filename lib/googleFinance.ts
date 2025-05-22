export async function fetchGoogleFinanceData(symbol: string): Promise<{ peRatio: number; earnings: number } | null> {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxBajrE3MLLLOP7p6A2Y8HrLHnbhGl-DLV0DgZhEgFt6UufMjEUy7fbqN45oXDuXa-xMQ/exec');
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
