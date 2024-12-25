import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
      retailer?: {
        id: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  next();
};

// Middleware to check if user is accessing their own resource
export const requireOwnership = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const resourceUserId = req.params.userId || req.body.userId;

  if (req.user.role !== "admin" && req.user.userId !== resourceUserId) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

// Middleware to validate wallet operations
export const validateWalletOperation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, operation } = req.body;

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (!operation || !["add", "subtract"].includes(operation)) {
    return res.status(400).json({ message: "Invalid operation type" });
  }

  next();
};

export const authenticateRetailer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = (authHeader && authHeader.split(" ")[1]) || req.cookies.token; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.retailer = {
        id: decoded.userId,
      };

      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
