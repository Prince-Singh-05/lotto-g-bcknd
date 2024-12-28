import Lottery from "../models/lottery.model";

// const Lottery = require("../models/lottery.model.ts");

const lotteries = [
  {
    name: "Lotto G 100",
    draw_date: "2024-03-25",
    draw_time: "1:00 PM",
    prizeTiers: [
      {
        prize: "1st",
        winners: 2,
        amount: 200000,
      },
      {
        prize: "2nd",
        winners: 5,
        amount: 50000,
      },
      {
        prize: "3rd",
        winners: 10,
        amount: 25000,
      },
      {
        prize: "4th",
        winners: 25,
        amount: 10000,
      },
      {
        prize: "5th",
        winners: 45,
        amount: 5000,
      },
      {
        prize: "6th",
        winners: 60,
        amount: 1000,
      },
    ],
    ticket_price: 100,
    category: "Daily",
    digit_length: 4,
  },
  {
    name: "Lotto G 200",
    draw_date: "2024-03-30",
    draw_time: "4:30 PM",
    prizeTiers: [
      {
        prize: "1st",
        winners: 1,
        amount: 1000000,
      },
      {
        prize: "2nd",
        winners: 2,
        amount: 100000,
      },
      {
        prize: "3rd",
        winners: 5,
        amount: 50000,
      },
      {
        prize: "4th",
        winners: 15,
        amount: 25000,
      },
      {
        prize: "5th",
        winners: 30,
        amount: 10000,
      },
      {
        prize: "6th",
        winners: 50,
        amount: 5000,
      },
      {
        prize: "7th",
        winners: 60,
        amount: 1000,
      },
    ],
    ticket_price: 200,
    category: "Weekly",
    digit_length: 4,
  },
  {
    name: "Lotto G 300",
    draw_date: "2024-03-30",
    draw_time: "8:00 PM",
    prizeTiers: [
      {
        prize: "1st",
        winners: 1,
        amount: 2000000,
      },
      {
        prize: "2nd",
        winners: 4,
        amount: 100000,
      },
      {
        prize: "3rd",
        winners: 10,
        amount: 50000,
      },
      {
        prize: "4th",
        winners: 25,
        amount: 25000,
      },
      {
        prize: "5th",
        winners: 55,
        amount: 10000,
      },
      {
        prize: "6th",
        winners: 70,
        amount: 5000,
      },
      {
        prize: "7th",
        winners: 100,
        amount: 1000,
      },
    ],
    ticket_price: 300,
    category: "Monthly",
    digit_length: 5,
  },
  {
    name: "Lotto G 100",
    draw_date: "2024-03-30",
    draw_time: "1:00 PM",
    prizeTiers: [
      {
        prize: "1st",
        winners: 2,
        amount: 200000,
      },
      {
        prize: "2nd",
        winners: 5,
        amount: 50000,
      },
      {
        prize: "3rd",
        winners: 10,
        amount: 25000,
      },
      {
        prize: "4th",
        winners: 25,
        amount: 10000,
      },
      {
        prize: "5th",
        winners: 45,
        amount: 5000,
      },
      {
        prize: "6th",
        winners: 60,
        amount: 1000,
      },
    ],
    ticket_price: 100,
    category: "Daily",
    digit_length: 4,
  },
  {
    name: "Lotto G 500",
    draw_date: "2024-03-30",
    draw_time: "10:00 AM",
    prizeTiers: [
      {
        prize: "1st",
        winners: 1,
        amount: 5000000,
      },
      {
        prize: "2nd",
        winners: 2,
        amount: 1000000,
      },
      {
        prize: "3rd",
        winners: 3,
        amount: 100000,
      },
      {
        prize: "4th",
        winners: 15,
        amount: 50000,
      },
      {
        prize: "5th",
        winners: 30,
        amount: 25000,
      },
      {
        prize: "6th",
        winners: 50,
        amount: 10000,
      },
      {
        prize: "7th",
        winners: 60,
        amount: 5000,
      },
    ],
    ticket_price: 500,
    category: "Special",
    digit_length: 5,
  },
  {
    name: "Lotto G 500",
    draw_date: "2024-03-30",
    draw_time: "10:00 AM",
    prizeTiers: [
      {
        prize: "1st",
        winners: 1,
        amount: 5000000,
      },
      {
        prize: "2nd",
        winners: 2,
        amount: 1000000,
      },
      {
        prize: "3rd",
        winners: 3,
        amount: 100000,
      },
      {
        prize: "4th",
        winners: 15,
        amount: 50000,
      },
      {
        prize: "5th",
        winners: 30,
        amount: 25000,
      },
      {
        prize: "6th",
        winners: 50,
        amount: 10000,
      },
      {
        prize: "7th",
        winners: 60,
        amount: 5000,
      },
    ],
    ticket_price: 500,
    category: "Special",
    digit_length: 5,
  },
  {
    name: "Lotto G 200",
    draw_date: "2024-03-30",
    draw_time: "4:30 PM",
    prizeTiers: [
      {
        prize: "1st",
        winners: 1,
        amount: 1000000,
      },
      {
        prize: "2nd",
        winners: 2,
        amount: 100000,
      },
      {
        prize: "3rd",
        winners: 5,
        amount: 50000,
      },
      {
        prize: "4th",
        winners: 15,
        amount: 25000,
      },
      {
        prize: "5th",
        winners: 30,
        amount: 10000,
      },
      {
        prize: "6th",
        winners: 50,
        amount: 5000,
      },
      {
        prize: "7th",
        winners: 60,
        amount: 1000,
      },
    ],
    ticket_price: 200,
    category: "weekly",
    digit_length: 4,
  },
];

const seedLotteries = async () => {
  try {
    // await Lottery.insertMany(lotteries);
    for (let i = 0; i < lotteries.length; i++) {
      await Lottery.create(lotteries[i]);
    }

    console.log("Lotteries seeded successfully");
  } catch (error) {
    console.error("Error seeding lotteries:", error);
  }
};

seedLotteries();
