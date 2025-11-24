import { Request, Response } from "express";
import { User } from "../models";
import { Role } from "../models/Role";
import jwt from "jsonwebtoken";

function generateToken(user: User) {
  // Ensure role is loaded or use a safe fallback
  const roleName = user.role?.name || "user";
  return jwt.sign(
    { id: user.id, role: roleName },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}

export const register = async (req: Request, res: Response) => {
  try {
    const exists = await User.findOne({ where: { email: req.body.email } });
    if (exists) return res.status(400).json({ error: "Email already used" });

    // Assign default 'user' role
    const userRole = await Role.findOne({ where: { name: "user" } });
    
    const user = await User.create({
        ...req.body,
        roleId: userRole ? userRole.id : null
    });
    
    // Reload with Role
    await user.reload({ include: [{ model: Role, as: "role" }] });

    return res.status(201).json({
      message: "User registered",
      user: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          role: user.role?.name
      },
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
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name,
      avatar: user.avatar,
    },
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
    role: req.user!.role?.name,
    // @ts-ignores
    avatar: req.user!.avatar,
  });
};

export const checkSetup = async (req: Request, res: Response) => {
  try {
    // Check if any user has 'admin' role
    const adminRole = await Role.findOne({ where: { name: "admin" } });
    if (!adminRole) {
        // If role doesn't exist, we assume setup is required (or DB init needed)
        return res.json({ setupRequired: true });
    }

    const adminCount = await User.count({ where: { roleId: adminRole.id } });
    return res.json({ setupRequired: adminCount === 0 });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const setupAdmin = async (req: Request, res: Response) => {
  try {
    const adminRole = await Role.findOne({ where: { name: "admin" } });
    if (!adminRole) return res.status(500).json({ error: "Admin role not found in system" });

    const adminCount = await User.count({ where: { roleId: adminRole.id } });
    if (adminCount > 0) {
      return res.status(403).json({ error: "Admin already exists" });
    }

    const user = await User.create({
      ...req.body,
      roleId: adminRole.id,
    });
    
    await user.reload({ include: [{ model: Role, as: "role" }] });

    return res.status(201).json({
      message: "Admin registered",
      user: { id: user.id, name: user.name, email: user.email, role: user.role?.name, avatar: user.avatar },
      token: generateToken(user),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
