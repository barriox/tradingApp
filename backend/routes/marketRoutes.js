import { Router } from "express";
import { MarketController } from "../controllers/marketController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const createMarketRouter = () => {
  const marketRouter = Router();
  const marketController = new MarketController();

  marketRouter.get("/:username/mercados", verifyToken, async (req, res) => {
    const marketsData = await marketController.fetchAllMarketsData();
    res.render("markets", { username: req.username, data: marketsData });
  });

  marketRouter.get("/:username", verifyToken, (req, res) => {
    res.render("profile", { username: req.username, userId: req.userId });
  });
  marketRouter.get("/:username/mercados/:id", verifyToken, async (req, res) => {
    const trade = req.params.id;
    const marketData = await marketController.fetchTradeData(trade);
    const lastPrice = marketData[marketData.length - 1].close;
    res.render("trade", {
      username: req.username,
      trade: trade,
      data: marketData,
      last: lastPrice,
    });
  });

  return marketRouter;
};

export default createMarketRouter;
