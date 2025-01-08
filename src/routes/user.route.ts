import { Router } from "express";
import {
	getKycDetails,
	getProfile,
	getWalletBalance,
	login,
	register,
	resetKyc,
	updateKyc,
	updateKycStatus,
	updateProfile,
	uploadKycDocuments,
} from "../controllers/user.controller";
import {
	authenticateToken,
	requireOwnership,
} from "../middlewares/auth.middleware";
import {
	getWalletTransactions,
	recordTransaction,
} from "../controllers/transaction.controller";
import { getUserTickets } from "../controllers/ticket.controller";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/getProfile", authenticateToken, requireOwnership, getProfile);
userRouter.put("/updateProfile", authenticateToken, updateProfile);
// userRouter.put("/update-wallet", authenticateToken, updateWalletBalance);
userRouter.post("/upload-kyc-documents", authenticateToken, uploadKycDocuments);
userRouter.put("/update-kyc-status", authenticateToken, updateKycStatus);
userRouter.get("/wallet", authenticateToken, getWalletBalance);
userRouter.get(
	"/wallet/transactions",
	authenticateToken,
	getWalletTransactions
);
userRouter.post("/purchase", authenticateToken, recordTransaction);
userRouter.get("/tickets", authenticateToken, getUserTickets);

// kyc
userRouter.get("/kyc/details", authenticateToken, getKycDetails);
userRouter.put("/kyc/update", authenticateToken, updateKyc);
userRouter.put("/kyc/reset", authenticateToken, resetKyc);

export default userRouter;
