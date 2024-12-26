import express from "express";
import { authenticateRetailer } from "../middlewares/auth.middleware";
import {
	getDashboardData,
	getRetailerStore,
	login,
	register,
	updateBranding,
} from "../controllers/retailer.controller";

const retailerRouter = express.Router();

// Register new retailer
retailerRouter.post("/register", register);

// Login retailer
retailerRouter.post("/login", login);

// Get retailer dashboard data
retailerRouter.get("/details", authenticateRetailer, getDashboardData);

// Update retailer branding
retailerRouter.put("/branding", authenticateRetailer, updateBranding);

// Get retailer by unique ID (public endpoint)
retailerRouter.get("/store/:uniqueId", getRetailerStore);

export default retailerRouter;
