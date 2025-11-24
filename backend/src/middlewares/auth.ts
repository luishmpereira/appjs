import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@/models";

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!req.user || !roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
