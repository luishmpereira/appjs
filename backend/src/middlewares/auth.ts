import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { defineAbilityFor, AppAbility } from "../config/abilities";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      ability?: AppAbility;
    }
  }
}

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
    };

    const user = await User.findByPk(payload.id, {
      include: [{ model: Role, as: "role" }],
    });
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    req.ability = defineAbilityFor(user);
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const checkAbility = (action: any, subject: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.ability) {
      return res.status(500).json({ error: "Ability not initialized" });
    }

    if (req.ability.can(action, subject)) {
      return next();
    }

    return res.status(403).json({ error: "Forbidden" });
  };
};

// Keep authorize for backward compatibility or simple role checks if needed
export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!req.user || !req.user.role || !roles.includes(req.user.role.name))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
