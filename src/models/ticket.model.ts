import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    lottery_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lottery",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ticket_number: {
      type: Number,
      required: true,
    },
    winning_amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "winning"],
      default: "active",
    },
    purchase_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
