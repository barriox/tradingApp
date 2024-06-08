import { Router } from "express";
import { WalletController } from "../controllers/walletController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const createWalletRouter = (WalletModel) => {
  const walletRouter = Router();
  const walletController = new WalletController({ WalletModel });

  walletRouter.post("/wallet/funds", verifyToken, (req, res) =>
    walletController.addFunds(req, res)
  );
  walletRouter.get("/wallet/:userid", verifyToken, (req, res) =>
    walletController.getWallet(req, res)
  );
  walletRouter.post("/wallet/generate", verifyToken, (req, res) => {
    console.log(req);
    walletController.addFunds(req, res);
  });
  return walletRouter;
};

export default createWalletRouter;
