import cron from "node-cron";
const { fetchAllMarketsData } = require("../services/marketService");

cron.schedule("0 * * * *", async () => {
  console.log("Fetching market data...");
  const marketDataArray = await fetchAllMarketsData();
  marketDataArray.forEach((marketData) => {
    if (marketData.error) {
      console.log(
        `Error fetching data for ${marketData.symbol}: ${marketData.error}`
      );
    } else {
      console.log(`Symbol: ${marketData.symbol}`);
      console.log(`Price Average: ${marketData.weightedAvgPrice}`);
      console.log(`Price Change Percent: ${marketData.priceChangePercent}%`);
      console.log(`Volume: ${marketData.volume}`);
      console.log("---");
    }
  });
});
