import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const createUserRouter = (userModel, WalletModel) => {
  const userRouter = Router();
  const userController = new UserController({ userModel, WalletModel });

  userRouter.post("/register", userController.register);
  userRouter.post("/login", userController.login);
  userRouter.get("/logout", userController.logout);
  userRouter.get("/:username", verifyToken, (req, res) => {
    res.render("profile", { userId: req.userId, username: req.username });
  });

  return userRouter;
};

export default createUserRouter;
