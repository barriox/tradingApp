export class WalletController {
  constructor({ WalletModel }) {
    this.walletModel = WalletModel;
  }

  createWallet = async (userId) => {
    const wallet = new this.walletModel({
      userid: userId,
      funds: 0,
      coinds: 0,
    });
    await wallet.save();
  };
  addFunds = async (req, res) => {
    const { userid, amount } = req.body;
    try {
      let wallet = await this.walletModel.findOne({ userid });
      if (!wallet) {
        return res.status(404).json({ error: "Wallet not found" });
      }
      wallet.funds += parseFloat(amount);
      wallet.totalGenerated += parseFloat(amount);
      await wallet.save();
      res.status(200).json(wallet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  getWallet = async ({ userid }) => {
    try {
      const wallet = await this.walletModel.findOne({ userid });
      return wallet;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };

  getFunds = async (req, res) => {
    const { userId } = req.body;
    try {
      const wallet = await this.walletModel.findOne({ userId });
      res.status(200).json(wallet.funds);
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  };
  hasEnoughFunds = async (userid, amount) => {
    const wallet = await this.walletModel.findOne({ userid });
    return wallet && wallet.funds >= amount;
  };

  hasEnoughCoins = async (userid, coin, quantity) => {
    const wallet = await this.walletModel.findOne({ userid });
    return wallet && (wallet.coins.get(coin) || 0) >= quantity;
  };
}
export default WalletController;
