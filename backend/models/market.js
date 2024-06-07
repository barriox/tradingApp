import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    base_currency: {
      type: String,
      required: true,
      unique: true,
    },
    quote_currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const userModel = mongoose.model("users", userSchema);
export default userModel;
