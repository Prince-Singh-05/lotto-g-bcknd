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

lotteryRouter.post("/", authenticateToken, requireAdmin, createLottery);
lotteryRouter.get("/", getAllLotteries);
lotteryRouter.get("/:lottery_id", getLotteryById);
lotteryRouter.put(
	"/:lottery_id",
	authenticateToken,
	requireAdmin,
	updateLottery
);
lotteryRouter.delete(
	"/:lottery_id",
	authenticateToken,
	requireAdmin,
	deleteLottery
);
lotteryRouter.post(
	"/:lottery_id/close",
	authenticateToken,
	requireAdmin,
	closeLottery
);

export default lotteryRouter;
