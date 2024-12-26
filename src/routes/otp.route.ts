import express from "express";
import { sendOTP } from "../controllers/otp.controller";

const otpRouter = express.Router();
otpRouter.post("/sendOtp", sendOTP);

export default otpRouter;
