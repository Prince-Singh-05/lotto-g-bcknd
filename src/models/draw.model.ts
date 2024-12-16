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
    winning_numbers: {
      type: [Number],
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
  },
  { timestamps: true }
);

const Draw = mongoose.model("Draw", drawSchema);

export default Draw;
