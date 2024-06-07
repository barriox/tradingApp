import mongoose from "mongoose";

const operationSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    remainingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const OperationModel = mongoose.model("Operation", operationSchema);

export default OperationModel;
