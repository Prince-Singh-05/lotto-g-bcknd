import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import userRouter from "./routes/user.route";
import ticketRouter from "./routes/ticket.route";
import retailerRouter from "./routes/retailer.route";
import affiliateTxnRouter from "./routes/affiliate.route";
import otpRouter from "./routes/otp.route";
import lotteryRouter from "./routes/lottery.route";

const app: Express = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/lottery", lotteryRouter);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/retailer", retailerRouter);
app.use("/api/v1/affiliate", affiliateTxnRouter);
app.use("/api/v1/otp", otpRouter);

// Basic health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
