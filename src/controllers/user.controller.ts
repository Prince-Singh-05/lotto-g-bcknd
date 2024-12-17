import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, phone_number, password, name, date_of_birth, role } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone_number }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or phone number already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      phone_number,
      name,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.role;
    delete updates.wallet_balance;

    const user = await User.findByIdAndUpdate(req.user?.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Update wallet balance
export const updateWalletBalance = async (req: Request, res: Response) => {
  try {
    const { amount, operation } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (operation === "add") {
      user.wallet_balance += amount;
    } else if (operation === "subtract") {
      if (user.wallet_balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      user.wallet_balance -= amount;
    }

    await user.save();
    res.status(200).json({
      message: "Wallet updated successfully",
      new_balance: user.wallet_balance,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Update KYC status (Admin only)
export const updateKycStatus = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.body;

    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { kyc: { status } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "KYC status updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Upload KYC documents
export const uploadKycDocuments = async (req: Request, res: Response) => {
  try {
    const { documents } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.kyc) {
      user.kyc = {
        status: "pending",
        documents: [],
      };
    }

    user.kyc.documents = documents;
    user.kyc.status = "pending";
    await user.save();

    res.status(200).json({
      message: "KYC documents uploaded successfully",
      kyc_status: user.kyc,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
