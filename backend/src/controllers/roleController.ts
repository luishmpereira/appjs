import { Request, Response } from "express";
import { Role } from "../models/Role";

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll({ order: [["id", "ASC"]] });
    return res.json(roles);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body;

    const exists = await Role.findOne({ where: { name } });
    if (exists) {
      return res.status(400).json({ error: "Role already exists" });
    }

    const role = await Role.create({ name, permissions: permissions || [] });
    return res.status(201).json(role);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    role.name = name || role.name;
    if (permissions) role.permissions = permissions;

    await role.save();
    return res.json(role);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Prevent deleting system roles if desired, but for now allow it (careful with admin)
    if (role.name === "admin" || role.name === "user") {
        // Maybe warn?
    }

    await role.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
