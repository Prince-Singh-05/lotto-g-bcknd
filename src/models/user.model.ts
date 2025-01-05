import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
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
		gender: {
			type: String,
			enum: ["male", "female"],
		},
		date_of_birth: {
			type: Date,
		},
		kyc: {
			status: {
				type: String,
				enum: ["pending", "approved", "rejected"],
				default: "pending",
			},
			documents: [
				{
					kycType: String,
					url: String,
					idNumber: String,
				},
			],
			bank_details: {
				bank_name: String,
				account_no: String,
				ifsc_code: String,
			},
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		wallet_balance: {
			type: Number,
			default: 0,
		},
		address: {
			local: {
				type: String,
				trim: true,
			},
			city: {
				type: String,
				trim: true,
			},
			state: {
				type: String,
				trim: true,
			},
			country: {
				type: String,
				trim: true,
			},
			pincode: {
				type: String,
				trim: true,
			},
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
