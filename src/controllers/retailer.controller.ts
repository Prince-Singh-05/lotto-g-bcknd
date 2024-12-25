import { Request, Response } from "express";
import Retailer from "../models/retailer.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AffiliateTransaction from "../models/affiliateTransaction.model";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

const generateUniqueId = async () => {
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const existingRetailer = await Retailer.findOne({ uniqueId });
  if (existingRetailer) {
    return generateUniqueId();
  }
  return uniqueId;
};

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, brandName } = req.body;

    // Check if retailer already exists
    const existingRetailer = await Retailer.findOne({ email });
    if (existingRetailer) {
      return res.status(400).json({ message: "Retailer already exists" });
    }

    // Generate unique ID for retailer
    const uniqueId = await generateUniqueId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const retailer = new Retailer({
      name,
      email,
      password: hashedPassword,
      brandName,
      uniqueId,
    });

    await retailer.save();
    res.status(201).json({
      message: "Retailer registered successfully",
      uniqueId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find retailer by email
    const retailer = await Retailer.findOne({ email });
    if (!retailer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, retailer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: retailer._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, { httpOnly: true }).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getDashboardData = async (req: Request, res: Response) => {
  try {
    const retailerId = req.retailer?.id;

    // Get retailer details
    const retailer = await Retailer.findById(retailerId);

    // Get affiliate transactions
    const transactions = await AffiliateTransaction.find({
      retailerId,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }).sort({ createdAt: -1 });

    // Calculate metrics
    const totalEarnings = transactions.reduce(
      (sum, tx) => sum + tx.commission,
      0
    );
    const pendingEarnings = transactions
      .filter((tx) => tx.status === "pending")
      .reduce((sum, tx) => sum + tx.commission, 0);

    res.json({
      retailer,
      metrics: {
        totalEarnings,
        pendingEarnings,
        transactionCount: transactions.length,
      },
      recentTransactions: transactions.slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateBranding = async (req: Request, res: Response) => {
  try {
    const { brandName, logo, customization } = req.body;
    const retailerId = req.retailer?.id;

    const retailer = await Retailer.findByIdAndUpdate(
      retailerId,
      {
        $set: {
          brandName,
          logo,
          customization,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    res.json(retailer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRetailerStore = async (req: Request, res: Response) => {
  try {
    const retailer = await Retailer.findOne({
      uniqueId: req.params.uniqueId,
    }).select("-password -wallet");

    if (!retailer) {
      return res.status(404).json({ message: "Retailer not found" });
    }

    res.json(retailer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { register, login, getRetailerStore, updateBranding, getDashboardData };
