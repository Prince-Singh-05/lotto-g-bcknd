import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { verifyOTP } from "../utils/helpers";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

// Register new user
export const register = async (req: Request, res: Response) => {
	try {
		const { email, phone: phoneNumber, countryCode, otp, name } = req.body;

		console.log("body - ", req.body);

		const phone = `${countryCode} ${phoneNumber}`;
		console.log("phone - ", phone);

		// if (!otp || !email || !phoneNumber || !name || otp === "") {
		// 	return res.status(400).json({ message: "All fields are required" });
		// }

		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [{ email }, { phoneNumber: phone }],
		});

		console.log("existingUser", existingUser);

		if (existingUser) {
			return res.status(400).json({
				message: "User with this email or phone number already exists",
			});
		}

		if (!verifyOTP(phone, otp)) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		// Create new user
		const user = new User({
			email,
			phoneNumber: phone,
			name,
		});

		await user.save();

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			JWT_SECRET,
			{
				expiresIn: "24h",
			}
		);

		res.cookie("userToken", token, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 1000,
		})
			.status(201)
			.json({
				message: "User registered successfully",
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					phoneNumber: user.phoneNumber,
				},
			});
	} catch (error) {
		console.log("User registration error", error);
		res.status(400).json({ message: (error as Error).message });
	}
};

// Login user
export const login = async (req: Request, res: Response) => {
	try {
		const { phone: phoneNumber, countryCode, otp } = req.body;
		console.log("body - ", req.body);

		// const phone = `${countryCode} ${phoneNumber}`;
		const phone = countryCode + " " + phoneNumber;
		console.log("login phone - ", phone);

		// Find user by email
		const user = await User.findOne({ phoneNumber: phone });
		if (!user) {
			return res
				.status(401)
				.json({ message: "No user found with this phone number" });
		}

		// Verify otp
		if (!verifyOTP(phone, otp)) {
			return res.status(401).json({ message: "Invalid OTP" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			JWT_SECRET,
			{
				expiresIn: "24h",
			}
		);

		res.status(200).json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phoneNumber: user.phoneNumber,
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
		delete updates.phoneNumber;
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
// export const updateWalletBalance = async (req: Request, res: Response) => {
// 	try {
// 		const { amount, operation } = req.body;
// 		const user = await User.findById(req.user?.userId);

//     console.log("userId", req.user?.userId);

// 		if (!user) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		if (operation === "add") {
// 			user.wallet_balance += amount;
// 		} else if (operation === "subtract") {
// 			if (user.wallet_balance < amount) {
// 				return res
// 					.status(400)
// 					.json({ message: "Insufficient balance" });
// 			}
// 			user.wallet_balance -= amount;
// 		}

// 		await user.save();
// 		res.status(200).json({
// 			message: "Wallet updated successfully",
// 			new_balance: user.wallet_balance,
// 		});
// 	} catch (error) {
// 		// res.json({ message: (error as Error).message });
//     res.status(400).json({message: (error as Error).message});
// 	}
// };

// get wallet balance
export const getWalletBalance = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.user?.userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(user.wallet_balance);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
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
				documents: [] as any,
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

// temporary upload for kyc
export const updateKyc = async (req: Request, res: Response) => {
	try {
		const { kycType, idNumber, otp } = req.body;
		const user = await User.findById(req.user?.userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (!verifyOTP(user.phoneNumber, otp)) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		if (!user.kyc) {
			return res.status(400).json({ message: "KYC not found" });
		}

		user.kyc.documents.push({
			kycType,
			url: "",
			idNumber,
		});
		user.kyc.status = "approved";
		await user.save();

		const kyc_details = {
			name: user.name,
			kyc: user.kyc,
			address: user.address,
			dob: user.date_of_birth,
			gender: user.gender,
			phone_no: user.phoneNumber,
		};

		res.status(200).json({
			message: "KYC status updated successfully",
			kyc_details,
		});
	} catch (error) {
		res.status(400).json({ message: (error as Error).message });
	}
};

export const getKycDetails = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.user?.userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const kyc_details = {
			name: user.name,
			kyc: user.kyc,
			address: user.address,
			dob: user.date_of_birth,
			gender: user.gender,
			phone_no: user.phoneNumber,
		};

		res.status(200).json(kyc_details);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};
