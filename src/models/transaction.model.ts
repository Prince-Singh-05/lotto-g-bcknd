import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transaction_type: {
      type: String,
      enum: ["purchase", "prize_payout", "withdrawal"],
      required: true,
    },
    lottery_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lottery",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
