import express from "express";
import {
	authenticateRetailer,
	authenticateToken,
} from "../middlewares/auth.middleware";
import {
	createAffiliateTransaction,
	getRetailerTransactions,
	processAffiliatePayment,
	getTransactionStats,
} from "../controllers/affiliate.controller";

const affiliateTxnRouter = express.Router();

// Create new affiliate transaction
affiliateTxnRouter.post(
	"/transaction",
	authenticateToken,
	createAffiliateTransaction
);

// Get retailer's transactions with pagination and filters
affiliateTxnRouter.get(
	"/transactions/:retailerId",
	authenticateRetailer,
	getRetailerTransactions
);

// Process affiliate payments
affiliateTxnRouter.post(
	"/process-payment/:retailerId",
	authenticateRetailer,
	processAffiliatePayment
);

// Get transaction statistics
affiliateTxnRouter.get(
	"/stats/:retailerId",
	authenticateRetailer,
	getTransactionStats
);

export default affiliateTxnRouter;
