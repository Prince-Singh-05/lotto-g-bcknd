import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    date_of_birth: {
      type: Date,
    },
    kyc: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      document: [
        {
          type: String,
          url: String,
        },
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    wallet_balance: {
      type: Number,
      default: 0,
    },
    address: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
