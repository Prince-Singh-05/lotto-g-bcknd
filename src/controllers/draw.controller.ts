import { Request, Response } from "express";
import Lottery from "../models/lottery.model";
import Ticket from "../models/ticket.model";
import Draw from "../models/draw.model";

// Conduct a draw for a lottery
export const conductDraw = async (req: Request, res: Response) => {
	try {
		const { lottery_id } = req.body;

		// Find the lottery
		const lottery = await Lottery.findById(lottery_id);
		if (!lottery) {
			return res.status(404).json({ message: "Lottery not found" });
		}

		// Check if the lottery is still open
		if (lottery.status !== "open") {
			return res
				.status(400)
				.json({ message: "Lottery is not open for draw" });
		}

		// Get all tickets for the lottery
		const tickets = await Ticket.find({ lottery_id });
		if (tickets.length === 0) {
			return res
				.status(400)
				.json({ message: "No tickets sold for this lottery" });
		}

		// Randomly select winning tickets (for example, 3 winners)
		// const winners = [];
		const numWinners = Math.min(3, tickets.length); // Limit winners to 3 or less
		const winningTicketNumbers = new Set();

		while (winningTicketNumbers.size < numWinners) {
			const randomIndex = Math.floor(Math.random() * tickets.length);
			winningTicketNumbers.add(tickets[randomIndex].ticket_number);
		}

		// Update lottery status to completed
		lottery.status = "completed";

		// update lottery prizes
		await lottery.save();

		// create draw for this lottery and add all winners

		res.status(200).json({
			message: "Draw conducted successfully",
			winners: Array.from(winningTicketNumbers),
		});
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

// Get draw results for a lottery
