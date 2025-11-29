import { Request, Response } from "express";
import { User } from "@/lib/prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../config/database";

async function generateToken(user: User) {
  const role = await prisma.role.findFirst({ where: { id: user.roleId } });
  const roleName = role?.name || "user";
  return jwt.sign({ id: user.id, role: roleName }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export const register = async (req: Request, res: Response) => {
  try {
    const exists = await prisma.user.findFirst({
      where: { email: req.body.email },
    });
    if (exists) return res.status(400).json({ error: "Email already used" });

    const userRole = await prisma.role.findFirst({ where: { name: "user" } });

    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: await bcrypt.hash(req.body.password, 10),
        roleId: userRole ? userRole.id : null,
      }
    });

    const userWithRole = await prisma.user.findFirst({
      where: { id: user.id },
      include: { role: true },
    });

    return res.status(201).json({
      message: "User registered",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userWithRole?.role?.name,
      },
      token: await generateToken(user),
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const user = req.user as User;
  const role = await prisma.role.findFirst({ where: { id: user.roleId } });
  const roleName = role?.name || "user";

  await prisma.userActivity.create({
    data: {
      message: `${user.name} fez login.`,
      userId: user.id,
    }
  });

  return res.json({
    message: "Logged in",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
      avatar: user.avatar,
    },
    token: await generateToken(user),
  });
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const user = req.user as User;
  const role = await prisma.role.findFirst({ where: { id: user.roleId } });
  const roleName = role?.name || "user";

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleName,
    avatar: user.avatar,
  });
};

export const checkSetup = async (req: Request, res: Response) => {
  try {
    const adminRole = await prisma.role.findFirst({ where: { name: "admin" } });
    if (!adminRole) {
      return res.json({ setupRequired: true });
    }

    const adminCount = await prisma.user.count({
      where: { roleId: adminRole.id },
    });
    return res.json({ setupRequired: adminCount === 0 });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const setupAdmin = async (req: Request, res: Response) => {
  try {
    const adminRole = await prisma.role.findFirst({ where: { name: "admin" } });
    if (!adminRole)
      return res.status(500).json({ error: "Admin role not found in system" });

    const adminCount = await prisma.user.count({
      where: { roleId: adminRole.id },
    });
    if (adminCount > 0) {
      return res.status(403).json({ error: "Admin already exists" });
    }

    const user = await prisma.user.create({
      data: {
        ...req.body,
        password: await bcrypt.hash(req.body.password, 10),
        roleId: adminRole.id,
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });

    return res.status(201).json({
      message: "Admin registered",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: updatedUser?.role?.name,
        avatar: user.avatar,
      },
      token: await generateToken(user),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
