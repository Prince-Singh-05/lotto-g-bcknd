import { Router } from "express";
import {
	authenticateToken,
	requireAdmin,
	requireOwnership,
	requireUser,
} from "../middlewares/auth.middleware";
import {
	cancelTicket,
	getTicketById,
	getTicketsByLotteryId,
	getUserTickets,
	markTicketAsWinning,
	purchaseTicket,
} from "../controllers/ticket.controller";

const ticketRouter = Router();

ticketRouter.post("/purchase", authenticateToken, purchaseTicket);
ticketRouter.get("/:ticket_id", getTicketById);
ticketRouter.post(
	"/cancel/:id",
	authenticateToken,
	requireOwnership,
	requireUser,
	cancelTicket
);
ticketRouter.post(
	"/mark-as-winning/:id",
	authenticateToken,
	requireAdmin,
	markTicketAsWinning
);
ticketRouter.get("/lottery/:lottery_id", getTicketsByLotteryId);

export default ticketRouter;
