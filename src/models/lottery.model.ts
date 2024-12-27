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
      trim: true,
    },
    ticket_price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["open", "closed", "completed"],
      default: "open",
    },
    draw_date: {
      type: String,
      required: true,
    },
    draw_time: {
      type: String,
      required: true,
    },
    ticket_sold: {
      type: Number,
    },
    prizeTiers: [
      {
        prize: {
          type: String,
        },
        winners: {
          type: Number,
        },
        amount: {
          type: Number,
        },
      },
    ],
    digit_length: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Lottery = mongoose.model("Lottery", lotterySchema);

export default Lottery;
