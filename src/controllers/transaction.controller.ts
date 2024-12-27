import { Request, Response } from "express";
import Transaction from "../models/transaction.model"; // Assuming you have a transaction model
import User from "../models/user.model";
// import { updateWalletBalance } from "./user.controller";

const updateWalletBalance = async (
	user_id: string,
	amount: number,
	operation: string
) => {
	try {
		const user = await User.findById(user_id);

		if (!user) {
			return;
		}

		if (operation === "add") {
			user.wallet_balance += amount;
		} else if (operation === "subtract") {
			if (user.wallet_balance < amount) {
				return;
			}
			user.wallet_balance -= amount;
		}

		await user.save();
		return user.wallet_balance;
	} catch (error) {
		console.log("Error:", error);
	}
};

// Record a transaction
export const recordTransaction = async (req: Request, res: Response) => {
	try {
		const {
			amount,
			transaction_type,
			lottery_id,
			operation,
			ticket_numbers,
		} = req.body;

		const user_id = req.user?.userId;

		console.log("ticket_numbers", ticket_numbers[0]);

		if (!user_id) {
			return res.status(401).json({ message: "No user Id found" });
		}

		// const transaction = new Transaction({
		// 	user_id,
		// 	amount,
		// 	lottery_id,
		// 	transaction_type,
		// 	ticket_numbers,
		// });

		const transaction = await Transaction.create({
			user_id,
			amount,
			lottery_id,
			transaction_type,
			ticket_numbers,
		});

		let updatedBalance;

		if (transaction_type === "wallet" || transaction_type === "purchase") {
			updatedBalance = await updateWalletBalance(
				user_id,
				amount,
				operation
			);
			transaction.status = "completed";
		}

		await transaction.save();

		res.status(201).json({ transaction, updatedBalance });
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

// Get transaction history for a user
export const getTransactionHistory = async (req: Request, res: Response) => {
	try {
		// const { user_id } = req.params;
		const user_id = req.user?.userId;

		const transactions = await Transaction.find({ user_id })
			.sort({
				createdAt: -1,
			})
			.exec();
		res.status(200).json(transactions);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const getWalletTransactions = async (req: Request, res: Response) => {
	try {
		const user_id = req.user?.userId;
		const transactions = await Transaction.find({
			user_id,
			$or: [
				{ transaction_type: "wallet" },
				{ transaction_type: "purchase" },
			],
		})
			.sort({ createdAt: -1 })
			.exec();
		res.status(200).json(transactions);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};
