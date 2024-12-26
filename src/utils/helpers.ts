import OTP from "../models/otp.model";
import Retailer from "../models/retailer.model";

const generateOTP = async () => {
	const otp = Math.floor(100000 + Math.random() * 900000);
	return otp;
};

const verifyOTP = async (phone: string, otp: string) => {
	const otpRecord = await OTP.findOne({ phone });
	if (!otpRecord) {
		return false;
	}
	return otpRecord.otp === otp;
};

const generateUniqueId = async () => {
	const uniqueId = Math.random().toString(36).substring(2, 9);
	const existingRetailer = await Retailer.findOne({ uniqueId });
	if (existingRetailer) {
		return generateUniqueId();
	}
	return uniqueId;
};

export { generateOTP, verifyOTP, generateUniqueId };
