import { Request, Response } from "express";
import { generateOTP } from "../utils/helpers";
import sendOtpViaTwilio from "../config/twilio";
import OTP from "../models/otp.model";

const sendOTP = async (req: Request, res: Response) => {
	try {
		const { phoneNumber, countryCode } = req.body;

		const phone = `${countryCode} ${phoneNumber}`;
		const otp = (await generateOTP()).toString();
		const otpsent = await sendOtpViaTwilio(phone, otp);

		if (!otpsent.success) {
			return res.status(400).json({ message: otpsent.error });
		}

		await OTP.create({
			phone,
			otp,
		});

		res.status(200).json({ message: "OTP sent successfully", otp });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export { sendOTP };
