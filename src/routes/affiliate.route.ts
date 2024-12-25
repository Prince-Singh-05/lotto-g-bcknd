import express from "express";
import { authenticateRetailer } from "../middlewares/auth.middleware";
import {
  createAffiliateTransaction,
  getRetailerTransactions,
  processAffiliatePayment,
  getTransactionStats,
} from "../controllers/affiliate.controller";

const affiliateTxnRouter = express.Router();

// Create new affiliate transaction
affiliateTxnRouter.post("/transaction", createAffiliateTransaction);

// Get retailer's transactions with pagination and filters
affiliateTxnRouter.get(
  "/:retailerId/transactions",
  authenticateRetailer,
  getRetailerTransactions
);

// Process affiliate payments
affiliateTxnRouter.post(
  "/:retailerId/process-payment",
  authenticateRetailer,
  processAffiliatePayment
);

// Get transaction statistics
affiliateTxnRouter.get(
  "/:retailerId/stats",
  authenticateRetailer,
  getTransactionStats
);

export default affiliateTxnRouter;
