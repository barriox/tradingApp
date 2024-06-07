import fetch from "node-fetch";

export class MarketController {
  fetchMarketData = async (symbol) => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
      );
      if (!response.ok) {
        throw new Error(`Error ${symbol} API: ${response.statusText}`);
      }
      const data = await response.json();
      const { weightedAvgPrice, priceChangePercent, volume } = data;
      return { symbol, weightedAvgPrice, priceChangePercent, volume };
    } catch (error) {
      console.error(`Error ${symbol}:`, error.message);
      return { symbol, error: error.message };
    }
  };

  fetchTradeData = async (symbol) => {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=1000`
    );
    if (!response.ok) {
      throw new Error(`Error ${symbol} API: ${response.statusText}`);
    }
    const data = await response.json();

    const cdata = data.map((d) => {
      return {
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      };
    });
    return cdata;
  };

  fetchAllMarketsData = async () => {
    const markets = [
      "BTCEUR",
      "ETHEUR",
      "BNBEUR",
      "SOLEUR",
      "XRPEUR",
      "ADAEUR",
      "TRXEUR",
      "LTCEUR",
      "DOTEUR",
    ];
    const marketDataPromises = markets.map((market) =>
      this.fetchMarketData(market)
    );
    return await Promise.all(marketDataPromises);
  };
}

export default MarketController;
