import mongoose, { Schema, Document } from "mongoose";

export interface IAffiliateTransaction extends Document {
  retailerId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  amount: number;
  commission: number;
  status: "pending" | "processed" | "cancelled";
  processedAt?: Date;
}

const AffiliateTransactionSchema: Schema = new Schema(
  {
    retailerId: {
      type: Schema.Types.ObjectId,
      ref: "Retailer",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processed", "cancelled"],
      default: "pending",
    },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IAffiliateTransaction>(
  "AffiliateTransaction",
  AffiliateTransactionSchema
);
