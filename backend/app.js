import express, { json } from "express";
import { createUserRouter } from "./routes/userRoutes.js";
import { createOperationRouter } from "./routes/operationRoutes.js";
import { createMarketRouter } from "./routes/marketRoutes.js";
import { createWalletRouter } from "./routes/walletRoutes.js";
import path from "path";
import { PORT } from "./config/config.js";
import { corsMiddleware } from "./middlewares/corsMiddleware.js";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

export const createApp = async (userModel, OperationModel, WalletModel) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();

  app.use(json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(express.static(path.join(__dirname, "../client/public")));
  app.get("/registro", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/register.html"));
  });
  app.get("/acceder", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/login.html"));
  });
  app.get("/recuperar", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/newPassword.html"));
  });

  app.use("/auth", createUserRouter(userModel, WalletModel));
  app.use("/", createMarketRouter());
  app.use("/", createOperationRouter(OperationModel, WalletModel));
  app.use("/", createWalletRouter(WalletModel));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
export default createApp;
