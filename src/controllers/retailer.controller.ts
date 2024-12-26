import { Request, Response } from "express";
import Retailer from "../models/retailer.model";
import jwt from "jsonwebtoken";
import AffiliateTransaction from "../models/affiliateTransaction.model";
import { generateUniqueId, verifyOTP } from "../utils/helpers";
import { AuthRegistrationsCredentialListMappingListInstance } from "twilio/lib/rest/api/v2010/account/sip/domain/authTypes/authTypeRegistrations/authRegistrationsCredentialListMapping";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone: phoneNumber,
      countryCode,
      brandName,
      otp,
    } = req.body;

    const phone = `${countryCode} ${phoneNumber}`;
    console.log("phone - ", phone);

    // Check if retailer already exists
    const existingRetailer = await Retailer.findOne({
      $or: [{ email }, { phoneNumber: phone }],
    });

    if (existingRetailer) {
      return res.status(400).json({
        message: "Retailer with this email or phone number already exists",
      });
    }

    if (!verifyOTP(phone, otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Generate unique ID for retailer
    const uniqueId = await generateUniqueId();

    const retailer = new Retailer({
      name,
      email,
      phoneNumber: phone,
      brandName,
      uniqueId,
    });

    // Generate JWT token
    const token = jwt.sign({ retailerId: retailer._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    await retailer.save();
    res
      .cookie("retailerToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000,
      })
      .status(201)
      .json({
        message: "Retailer registered successfully",
        uniqueId,
        token,
        retailer,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { countryCode, phone: phoneNumber, otp } = req.body;

    const phone = `${countryCode} ${phoneNumber}`;
    console.log("phone - ", phone);

    // Find retailer by email
    const retailer = await Retailer.findOne({ phoneNumber: phone });
    if (!retailer) {
      return res
        .status(401)
        .json({ message: "No retailer found with this phone number" });
    }

    // Verify otp
    if (!verifyOTP(phone, otp)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Generate JWT token
    const token = jwt.sign({ retailerId: retailer._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res
      .cookie("retailerToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000,
      })
      .json({ message: "Login successful", token, retailer });
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

    const customerCount = new Set(transactions.map((tx) => tx.customerId));

    const totalSalesAmount = transactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    res.json({
      retailer,
      metrics: {
        totalEarnings,
        pendingEarnings,
        totalSales: totalSalesAmount,
        transactionCount: transactions.length,
        customerCount: customerCount.size,
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
