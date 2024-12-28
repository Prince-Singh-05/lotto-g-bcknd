import mongoose from "mongoose";

const drawSchema = new mongoose.Schema(
	{
		lottery_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Lottery",
			required: true,
		},
		draw_date: {
			type: Date,
			required: true,
		},
		winners: [
			{
				ticket_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Ticket",
					required: true,
				},
				user_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				prize_amount: {
					type: Number,
					required: true,
				},
			},
		],
		winners_by_prizeTiers: [
			{
				prize_tier: {
					type: Number,
				},
				winning_tickets: {
					type: [String],
				},
				prize_amount: {
					type: Number,
				},
			},
		],
	},
	{ timestamps: true }
);

const Draw = mongoose.model("Draw", drawSchema);

export default Draw;
