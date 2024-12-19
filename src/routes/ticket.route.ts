import { Router } from "express";
import { authenticateToken, requireAdmin, requireOwnership, requireUser } from "../middlewares/auth.middleware";
import { cancelTicket, getTicketById, getUserTickets, markTicketAsWinning, purchaseTicket } from "../controllers/ticket.controller";

const ticketRouter = Router();

ticketRouter.post("purchase", authenticateToken, requireUser, purchaseTicket);
ticketRouter.get("/:userId", authenticateToken, requireOwnership, getUserTickets);
ticketRouter.get("/:ticket_id", getTicketById);
ticketRouter.post("/cancel/:id", authenticateToken, requireOwnership, requireUser, cancelTicket);
ticketRouter.post("/mark-as-winning/:id", authenticateToken, requireAdmin, markTicketAsWinning);

export default ticketRouter;