import mongoose from "mongoose";

const lotterySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    ticket_price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    ticket_prize: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["open", "closed", "completed"],
    },
    draw_date: {
      type: Date,
    },
    ticket_sold: {
      type: Number,
    },
    prizes: [
      {
        ticket_number: {
          type: Number,
        },
        amount: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const Lottery = mongoose.model("Lottery", lotterySchema);

export default Lottery;
