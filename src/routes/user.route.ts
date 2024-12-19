import { Router } from "express";
import {
	getProfile,
	login,
	register,
	updateKycStatus,
	updateProfile,
	updateWalletBalance,
	uploadKycDocuments,
} from "../controllers/user.controller";
import {
	authenticateToken,
	requireOwnership,
} from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", authenticateToken, login);
userRouter.get("/getProfile", authenticateToken, requireOwnership, getProfile);
userRouter.put(
	"/updateProfile",
	authenticateToken,
	requireOwnership,
	updateProfile
);
userRouter.put(
	"/update-wallet",
	authenticateToken,
	requireOwnership,
	updateWalletBalance
);
userRouter.post(
	"/upload-kyc-documents",
	authenticateToken,
	requireOwnership,
	uploadKycDocuments
);
userRouter.put(
	"/update-kyc-status",
	authenticateToken,
	requireOwnership,
	updateKycStatus
);

export default userRouter;
