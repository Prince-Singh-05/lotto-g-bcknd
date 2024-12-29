// config/twilio.js
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.TWILIO_SID ||
  !process.env.TWILIO_AUTH_TOKEN ||
  !process.env.TWILIO_PHONE_NUMBER
) {
  throw new Error("Missing Twilio credentials in environment variables.");
}

// Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtpViaTwilio = async (phone: string, otp: string) => {
  // console.log(phone, otp);
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone.toString(),
      body: `Your OTP code is ${otp}`,
    });
    // console.log(message);
    return { success: true, message: message.sid };
  } catch (error) {
    console.error("Error sending OTP via Twilio:", error);
    return { success: false, error: (error as Error).message };
  }
};

export default sendOtpViaTwilio;
