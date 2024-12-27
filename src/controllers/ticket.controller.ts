import { Request, Response } from "express";
import Ticket from "../models/ticket.model";
import Lottery from "../models/lottery.model";

export const purchaseTicket = async (req: Request, res: Response) => {
	try {
		const { lottery_id, custom_ticket_numbers } = req.body;

		const user_id = req.user?.userId;

		// Check if lottery exists and is open
		const lottery = await Lottery.findById(lottery_id);
		if (!lottery) {
			return res.status(404).json({ message: "Lottery not found" });
		}
		if (lottery.status !== "open") {
			return res
				.status(400)
				.json({ message: "Lottery is not open for ticket purchase" });
		}

		for (let i = 0; i < custom_ticket_numbers.length; i++) {
			const ticket = await Ticket.create({
				lottery_id,
				user_id,
				ticket_number: custom_ticket_numbers[i],
				purchase_date: new Date(),
				status: "active",
			});
		}

		// Update lottery ticket sold count
		await Lottery.findByIdAndUpdate(lottery_id, {
			$inc: { ticket_sold: 1 },
		});

		res.status(201).json({ message: "Tickets purchased successfully" });
	} catch (error) {
		res.status(400).json({ message: (error as Error).message });
	}
};

export const getUserTickets = async (req: Request, res: Response) => {
	try {
		const tickets = await Ticket.find({
			user_id: req.user?.userId,
		}).populate("lottery_id", "name description draw_date");
		res.status(200).json(tickets);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const getTicketsByLotteryId = async (req: Request, res: Response) => {
	try {
		const tickets = await Ticket.find({
			lottery_id: req.params.lotteryId,
		}).populate("lottery_id", "name description draw_date");
		res.status(200).json(tickets);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const getTicketById = async (req: Request, res: Response) => {
	try {
		const ticket = await Ticket.findById(req.params.ticket_id).populate(
			"lottery_id",
			"name description draw_date"
		);
		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}
		res.status(200).json(ticket);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const cancelTicket = async (req: Request, res: Response) => {
	try {
		const ticket = await Ticket.findById(req.params.id);
		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}

		// Check if lottery is still open
		const lottery = await Lottery.findById(ticket.lottery_id);
		if (!lottery || lottery.status !== "open") {
			return res.status(400).json({
				message: "Cannot cancel ticket - lottery is not open",
			});
		}

		ticket.status = "cancelled";
		await ticket.save();

		// Decrement lottery ticket sold count
		await Lottery.findByIdAndUpdate(ticket.lottery_id, {
			$inc: { ticket_sold: -1 },
		});

		res.status(200).json(ticket);
	} catch (error) {
		res.status(400).json({ message: (error as Error).message });
	}
};

export const markTicketAsWinning = async (req: Request, res: Response) => {
	try {
		const { winning_amount } = req.body;
		const ticket = await Ticket.findByIdAndUpdate(
			req.params.id,
			{
				status: "winning",
				winning_amount,
			},
			{ new: true }
		);

		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}

		res.status(200).json(ticket);
	} catch (error) {
		res.status(400).json({ message: (error as Error).message });
	}
};
