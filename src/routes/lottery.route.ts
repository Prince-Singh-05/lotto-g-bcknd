import { Router } from "express";
import {
	closeLottery,
	createLottery,
	deleteLottery,
	getAllLotteries,
	getLotteryById,
	updateLottery,
} from "../controllers/lottery.controller";
import {
	authenticateToken,
	requireAdmin,
} from "../middlewares/auth.middleware";

const lotteryRouter = Router();

lotteryRouter.post("/create", authenticateToken, requireAdmin, createLottery);
lotteryRouter.get("/getAll", getAllLotteries);
lotteryRouter.get("/getLottery/:lottery_id", getLotteryById);
lotteryRouter.put(
	"/updateLottery/:lottery_id",
	authenticateToken,
	requireAdmin,
	updateLottery
);
lotteryRouter.delete(
	"/deleteLottery/:lottery_id",
	authenticateToken,
	requireAdmin,
	deleteLottery
);
lotteryRouter.post(
	"closeLottery/:lottery_id",
	authenticateToken,
	requireAdmin,
	closeLottery
);

export default lotteryRouter;
