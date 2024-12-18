import { Request, Response } from "express";
import Lottery from "../models/lottery.model";

export const createLottery = async (req: Request, res: Response) => {
  try {
    const lottery = new Lottery(req.body);
    await lottery.save();
    res.status(201).json(lottery);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllLotteries = async (req: Request, res: Response) => {
  try {
    const lotteries = await Lottery.find({});
    res.status(200).json(lotteries);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getLotteryById = async (req: Request, res: Response) => {
  try {
    const lottery = await Lottery.findById(req.params.id);
    if (!lottery) {
      return res.status(404).json({ message: "Lottery not found" });
    }
    res.status(200).json(lottery);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateLottery = async (req: Request, res: Response) => {
  try {
    const lottery = await Lottery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lottery) {
      return res.status(404).json({ message: "Lottery not found" });
    }
    res.status(200).json(lottery);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteLottery = async (req: Request, res: Response) => {
  try {
    const lottery = await Lottery.findByIdAndDelete(req.params.id);
    if (!lottery) {
      return res.status(404).json({ message: "Lottery not found" });
    }
    res.status(200).json({ message: "Lottery deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const closeLottery = async (req: Request, res: Response) => {
  try {
    const lottery = await Lottery.findByIdAndUpdate(
      req.params.id,
      { status: "closed" },
      { new: true }
    );
    if (!lottery) {
      return res.status(404).json({ message: "Lottery not found" });
    }
    res.status(200).json(lottery);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
