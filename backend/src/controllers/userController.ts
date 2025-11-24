import { Request, Response } from "express";
import { User } from "../models";
import { Role } from "../models/Role";
import bcrypt from "bcryptjs";
import { subject } from "@casl/ability";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: Role, as: "role" }],
      order: [["id", "ASC"]],
    });
    // Flatten role for frontend compatibility if needed, or update frontend
    const formattedUsers = users.map(u => ({
        ...u.toJSON(),
        role: u.role?.name
    }));
    return res.json(formattedUsers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }
    
    // Look up role
    const roleObj = await Role.findOne({ where: { name: role || "user" } });
    if (!roleObj) {
         return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.create({ 
        name, 
        email, 
        password, 
        roleId: roleObj.id 
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

    const user = await User.findByPk(id, { include: [{ model: Role, as: "role" }] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check permissions
    // We use subject helper to tell CASL that this object is a "User" subject
    if (req.ability?.cannot("update", subject("User", user))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    
    if (avatar !== undefined) {
        user.avatar = avatar;
    }
    
    // Only admin can update role
    if (role && (req.user as User)?.role?.name === "admin") {
       const roleObj = await Role.findOne({ where: { name: role } });
       if (roleObj) {
           user.roleId = roleObj.id;
           user.role = roleObj; // update loaded instance
       }
    }

    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

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
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.ability?.cannot("delete", subject("User", user))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await user.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
