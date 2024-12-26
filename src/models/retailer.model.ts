import mongoose, { Document } from "mongoose";

interface IRetailer extends Document {
	name: string;
	email: string;
	phoneNumber: string;
	uniqueId: string;
	brandName: string;
	logo: string;
	commissionRate: number;
	wallet: {
		balance: number;
		pendingBalance: number;
	};
	customization: {
		primaryColor: string;
		secondaryColor: string;
		brandingText: string;
	};
}

const RetailerSchema: mongoose.Schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phoneNumber: {
			type: String,
			required: true,
      unique: true,
		},
		uniqueId: {
			type: String,
			required: true,
			unique: true,
		},
		brandName: {
			type: String,
			required: true,
		},
		logo: {
			type: String,
		},
		commissionRate: {
			type: Number,
			default: 5, // Default 5% commission
		},
		wallet: {
			balance: {
				type: Number,
				default: 0,
			},
			pendingBalance: {
				type: Number,
				default: 0,
			},
		},
		customization: {
			primaryColor: {
				type: String,
				default: "#000000",
			},
			secondaryColor: {
				type: String,
				default: "#ffffff",
			},
			brandingText: {
				type: String,
			},
		},
	},
	{ timestamps: true }
);

export default mongoose.model<IRetailer>("Retailer", RetailerSchema);
