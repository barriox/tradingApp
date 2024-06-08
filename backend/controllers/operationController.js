import { WalletController } from "./walletController.js";
export class OperationController {
  constructor({ OperationModel, WalletModel }) {
    this.OperationModel = OperationModel;
    this.walletController = new WalletController({ WalletModel });
  }
  create = async (req, res) => {
    try {
      const { name, price, quantity, type } = req.body;
      const userid = req.userId;
      const hasEnough =
        type === "buy"
          ? await this.walletController.hasEnoughFunds(userid, price * quantity)
          : await this.walletController.hasEnoughCoins(userid, name, quantity);
      if (!hasEnough) {
        return res
          .status(400)
          .json({ error: "No hay suficientes fondos o monedas" });
      }

      const operation = new this.OperationModel({
        userid,
        name,
        price,
        quantity,
        type,
        remainingQuantity: type === "buy" ? quantity : 0,
      });
      await operation.save();
      await this.updateWalletAfterOperation(
        userid,
        name,
        quantity,
        type,
        price
      );

      res.status(201).json(operation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  remove = async (req, res) => {
    try {
      const { id } = req.params;
      const operation = await this.OperationModel.findByIdAndDelete(id);

      if (!operation) {
        return res.status(404).json({ error: "Operacion no encontrada" });
      }

      res.status(200).json({ message: "Operación eliminada" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getAllOperations = async (req, res) => {
    try {
      const operations = await this.OperationModel.find({}).sort({
        createdAt: -1,
      });
      if (!operations) {
        return res.status(404).json({ message: "Todavía no hay operaciones" });
      }

      res.status(200).json(operations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  updateWalletAfterOperation = async (userid, coin, quantity, type, price) => {
    let wallet = await this.walletController.getWallet({ userid });
    if (type == "buy") {
      wallet.funds -= price * quantity;
      wallet.coins.set(coin, (wallet.coins.get(coin) || 0) + quantity);
    } else {
      wallet.funds += price * quantity;
      wallet.coins.set(coin, (wallet.coins.get(coin) || 0) - quantity);
    }
    await wallet.save();
  };
  fetchCurrentPrices = async (coins) => {
    const prices = {};
    for (let coin of coins) {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${coin.toUpperCase()}`
        );
        const result = await response.json();
        prices[coin] = parseFloat(result.price);
      } catch (error) {
        console.error(`Error fetching price for ${coin}:`, error);
      }
    }
    return prices;
  };

  calculateStatistics = async (req, res) => {
    const userid = req.userId;
    const wallet = await this.walletController.getWallet({ userid });
    const currentFunds = wallet.funds;
    const generatedFunds = wallet.totalGenerated;
    const investedFunds =
      generatedFunds > currentFunds ? generatedFunds - currentFunds : 0;
    const coins = Array.from(wallet.coins.keys());
    const currentPrices = await this.fetchCurrentPrices(coins);
    const statistics = {};
    let totalMarketValue = 0;
    for (let coin of coins) {
      const buyOperations = await this.OperationModel.find({
        userid,
        name: coin,
        type: "buy",
      }).sort({ createdAt: 1 });

      const sellOperations = await this.OperationModel.find({
        userid,
        name: coin,
        type: "sell",
      }).sort({ createdAt: 1 });

      let totalAmountBought = 0;
      let totalCost = 0;

      buyOperations.forEach((op) => {
        totalAmountBought += op.quantity;
        totalCost += op.quantity * op.price;
      });

      let remainingQuantity = totalAmountBought;
      for (let sellOp of sellOperations) {
        remainingQuantity -= sellOp.quantity;
      }
      const avgBuyingPrice = totalCost / totalAmountBought;
      const currentPrice = currentPrices[coin] || 0;
      const currentMarketValue = remainingQuantity * currentPrice;
      totalMarketValue += currentMarketValue;
      const percentageChange =
        ((currentPrice - avgBuyingPrice) / avgBuyingPrice) * 100;

      const totalValueChange =
        currentMarketValue - avgBuyingPrice * remainingQuantity;

      statistics[coin] = {
        totalAmountHeld: remainingQuantity,
        avgBuyingPrice,
        currentMarketValue,
        percentageChange,
        totalValueChange,
      };
    }

    let sumCurrentMarketValue = 0;
    let sumTotalValueChange = 0;
    let weightedPercentageChange = 0;

    for (let c in statistics) {
      sumCurrentMarketValue += statistics[c].currentMarketValue;
      sumTotalValueChange += statistics[c].totalValueChange;
      let weight = statistics[c].currentMarketValue / totalMarketValue;
      weightedPercentageChange += statistics[c].percentageChange * weight;
    }

    res.status(200).json({
      currentMarketValue: sumCurrentMarketValue.toFixed(2),
      percentageChange: weightedPercentageChange.toFixed(2),
      totalValueChange: sumTotalValueChange.toFixed(2),
      currentFunds: currentFunds.toFixed(2),
      generatedFunds: generatedFunds.toFixed(2),
      investedFunds: (
        (generatedFunds - currentFunds) *
        ((100 + weightedPercentageChange) / 100)
      ).toFixed(2),
    });
  };
}
