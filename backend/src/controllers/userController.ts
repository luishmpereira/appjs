import { Request, Response } from "express";
import prisma from "../config/database";
import bcrypt from "bcryptjs";
import { subject } from "@casl/ability";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: { select: { name: true } } },
      orderBy: { id: "asc" },
      take: limit,
      skip: offset
    });
    console.log(users)

    return res.json({
      data: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name
      })),
      meta: {
        total: users.length,
        page,
        last_page: Math.ceil(users.length / limit),
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await prisma.user.findFirst({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const roleObj = await prisma.role.findFirst({ where: { name: role || "user" } });
    if (!roleObj) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        roleId: roleObj.id
      }
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleObj.name,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, password, avatar } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: +(id || 0)
      }, 
      include: { role: true }
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.ability?.cannot("update", subject("User", user))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    const roleObj = await prisma.role.findFirst({ where: { id: user.roleId } });

    if (role && roleObj?.name === "admin") {
      const roleObj = await prisma.role.findFirst({ where: { name: role } });
      if (roleObj) {
        user.roleId = roleObj.id;
        user.role = roleObj; 
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        avatar: user.avatar,
        password: user.password,
      }
    });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name,
      avatar: user.avatar,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: +(id || 0)
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.ability?.cannot("delete", subject("User", user))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.user.delete({
      where: { id: user.id }
    });
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
