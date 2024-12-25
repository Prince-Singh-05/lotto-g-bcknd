import { Request, Response } from "express";
import Transaction from "../models/transaction.model"; // Assuming you have a transaction model

// Record a transaction
export const recordTransaction = async (req: Request, res: Response) => {
  try {
    const { user_id, amount, type } = req.body;

    const transaction = new Transaction({
      user_id,
      amount,
      type,
      date: new Date(),
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get transaction history for a user
export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const transactions = await Transaction.find({ user_id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
