import { Router } from "express";
import { OperationController } from "../controllers/operationController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const createOperationRouter = (OperationModel, WalletModel) => {
  const operationRouter = Router();
  const operationController = new OperationController({
    OperationModel,
    WalletModel,
  });

  operationRouter.post("/operations", verifyToken, (req, res) => {
    operationController.create(req, res);
  });
  operationRouter.get(
    "/:username/operations",
    verifyToken,
    operationController.getAllOperations
  );
  operationRouter.get(
    "/:username/statistics",
    verifyToken,
    operationController.calculateStatistics
  );

  operationRouter.delete("/:username", verifyToken, operationController.remove);

  return operationRouter;
};

export default createOperationRouter;
