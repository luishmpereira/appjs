import { Request, Response } from "express";
import { MovementLine } from "../models";
import { subject } from "@casl/ability";

export const getAllMovementLines = async (req: Request, res: Response) => {
  try {
    const movementLines = await MovementLine.findAll({ order: [["id", "ASC"]] });
    return res.json(movementLines);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMovementLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movementLine = await MovementLine.findByPk(id);
    if (!movementLine) return res.status(404).json({ error: "MovementLine not found" });
    return res.json(movementLine);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createMovementLine = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, movementId } = req.body;
    
    const movementLine = await MovementLine.create({
      productId,
      quantity,
      movementId
    });

    return res.status(201).json(movementLine);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateMovementLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movementLine = await MovementLine.findByPk(id);
    
    if (!movementLine) return res.status(404).json({ error: "MovementLine not found" });

    if (req.ability?.cannot("update", subject("MovementLine", movementLine))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { productId, quantity, movementId } = req.body;

    await movementLine.update({
      productId,
      quantity,
      movementId
    });

    return res.json(movementLine);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteMovementLine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movementLine = await MovementLine.findByPk(id);
    
    if (!movementLine) return res.status(404).json({ error: "MovementLine not found" });

    if (req.ability?.cannot("delete", subject("MovementLine", movementLine))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await movementLine.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
