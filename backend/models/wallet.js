import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    funds: {
      type: Number,
      default: 0,
    },
    totalGenerated: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

export const WalletModel = mongoose.model("Wallet", walletSchema);
