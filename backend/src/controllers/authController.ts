import { Request, Response } from "express";
import { User } from "../models";
import jwt from "jsonwebtoken";

function generateToken(user: User) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}

export const register = async (req: Request, res: Response) => {
  try {
    const exists = await User.findOne({ where: { email: req.body.email } });
    if (exists) return res.status(400).json({ error: "Email already used" });

    const user = await User.create(req.body);

    return res.status(201).json({
      message: "User registered",
      user: { id: user.id, name: user.name, email: user.email },
      token: generateToken(user),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const user = req.user as User;

  return res.json({
    message: "Logged in",
    token: generateToken(user),
  });
};

export const me = (req: Request, res: Response) => {
  return res.json({
    // @ts-ignore
    id: req.user!.id,
    // @ts-ignore
    name: req.user!.name,
    // @ts-ignore
    email: req.user!.email,
    // @ts-ignores
    role: req.user!.role,
  });
};
