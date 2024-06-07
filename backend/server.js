import { createApp } from "./app.js";
import connectDB from "./config/database.js";
import { userModel } from "./models/user.js";
import { OperationModel } from "./models/operation.js";
import { WalletModel } from "./models/wallet.js";
async function main() {
  try {
    await connectDB();
    await createApp(userModel, OperationModel, WalletModel);
  } catch (error) {
    console.error(error);
  }
}
main();
