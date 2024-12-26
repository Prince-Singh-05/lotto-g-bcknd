import mongoose from "mongoose";

interface IOtp {
  phone: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    expires: "5m",
    default: Date.now,
  },
});

const OTP = mongoose.model<IOtp>("OTP", OtpSchema);

export default OTP;
