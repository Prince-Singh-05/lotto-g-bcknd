import { Request, Response } from "express";
import AffiliateTransaction from "../models/affiliateTransaction.model";
import Retailer from "../models/retailer.model";

export const createAffiliateTransaction = async (
	req: Request,
	res: Response
) => {
	try {
		const { retailerId, customerId, transactionId, amount } = req.body;

		// Get retailer's commission rate
		const retailer = await Retailer.findById(retailerId);
		if (!retailer) {
			throw new Error("Retailer not found");
		}

		const commission = (amount * retailer.commissionRate) / 100;

		// Create and populate transaction
		const transaction = await AffiliateTransaction.create({
			retailerId,
			customerId,
			transactionId,
			amount,
			commission,
			status: "pending",
		});

		// Populate references
		const populatedTransaction = await AffiliateTransaction.findById(
			transaction._id
		)
			.populate({
				path: "transactionId",
				select: "amount transaction_type createdAt",
			})
			.populate({
				path: "retailerId",
				select: "name email brandName",
			})
			.populate({
				path: "customerId",
				select: "name email",
			});

		// Update retailer's pending balance
		await Retailer.findByIdAndUpdate(retailerId, {
			$inc: { "wallet.pendingBalance": commission },
		});

		res.status(201).json(populatedTransaction);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const getRetailerTransactions = async (req: Request, res: Response) => {
	try {
		const retailerId = req.retailer?.id;
		const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

		const query: any = { retailerId };

		if (status) {
			query.status = status;
		}

		if (startDate && endDate) {
			query.createdAt = {
				$gte: new Date(startDate as string),
				$lte: new Date(endDate as string),
			};
		}

		const skip = (Number(page) - 1) * Number(limit);

		const transactions = await AffiliateTransaction.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(Number(limit))
			.populate("orderId", "orderNumber totalAmount")
			.populate("customerId", "name email");

		const total = await AffiliateTransaction.countDocuments(query);

		res.json({
			transactions,
			pagination: {
				total,
				page: Number(page),
				pages: Math.ceil(total / Number(limit)),
			},
		});
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const processAffiliatePayment = async (req: Request, res: Response) => {
	try {
		const { transactionIds } = req.body;
		const { retailerId } = req.params;

		const transactions = await AffiliateTransaction.find({
			_id: { $in: transactionIds },
			retailerId,
			status: "pending",
		});

		if (!transactions.length) {
			throw new Error("No valid pending transactions found");
		}

		const totalCommission = transactions.reduce(
			(sum, tx) => sum + tx.commission,
			0
		);

		// Update all transactions to processed
		await AffiliateTransaction.updateMany(
			{ _id: { $in: transactionIds } },
			{
				$set: {
					status: "processed",
					processedAt: new Date(),
				},
			}
		);

		// Update retailer wallet
		await Retailer.findByIdAndUpdate(retailerId, {
			$inc: {
				"wallet.balance": totalCommission,
				"wallet.pendingBalance": -totalCommission,
			},
		});

		res.json({
			message: "Transactions processed successfully",
			processedCount: transactions.length,
			totalCommission,
		});
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const getTransactionStats = async (req: Request, res: Response) => {
	try {
		const { retailerId } = req.params;
		const { startDate, endDate } = req.query;

		const dateQuery: any = {};
		if (startDate && endDate) {
			dateQuery.createdAt = {
				$gte: new Date(startDate as string),
				$lte: new Date(endDate as string),
			};
		}

		const [totalStats, pendingStats, processedStats] = await Promise.all([
			AffiliateTransaction.aggregate([
				{
					$match: {
						retailerId: retailerId,
						...dateQuery,
					},
				},
				{
					$group: {
						_id: null,
						totalCommission: { $sum: "$commission" },
						totalTransactions: { $sum: 1 },
						totalAmount: { $sum: "$amount" },
					},
				},
			]),
			AffiliateTransaction.aggregate([
				{
					$match: {
						retailerId: retailerId,
						status: "pending",
						...dateQuery,
					},
				},
				{
					$group: {
						_id: null,
						pendingCommission: { $sum: "$commission" },
						pendingTransactions: { $sum: 1 },
					},
				},
			]),
			AffiliateTransaction.aggregate([
				{
					$match: {
						retailerId: retailerId,
						status: "processed",
						...dateQuery,
					},
				},
				{
					$group: {
						_id: null,
						processedCommission: { $sum: "$commission" },
						processedTransactions: { $sum: 1 },
					},
				},
			]),
		]);

		res.json({
			total: totalStats[0] || {
				totalCommission: 0,
				totalTransactions: 0,
				totalAmount: 0,
			},
			pending: pendingStats[0] || {
				pendingCommission: 0,
				pendingTransactions: 0,
			},
			processed: processedStats[0] || {
				processedCommission: 0,
				processedTransactions: 0,
			},
		});
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};
