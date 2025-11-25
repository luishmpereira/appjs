import { Request, Response } from "express";
import { Operation } from "../models";
import { subject } from "@casl/ability";

export const getAllOperations = async (req: Request, res: Response) => {
  try {
    const operations = await Operation.findAll({ order: [["name", "ASC"]] });
    return res.json(operations);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getOperation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const operation = await Operation.findByPk(id);
    if (!operation) return res.status(404).json({ error: "Operation not found" });
    return res.json(operation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createOperation = async (req: Request, res: Response) => {
  try {
    const { name, operationCode, operationType, changeInventory, hasFinance } = req.body;
    
    const operation = await Operation.create({
      name,
      operationCode,
      operationType,
      changeInventory,
      hasFinance
    });

    return res.status(201).json(operation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateOperation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const operation = await Operation.findByPk(id);
    
    if (!operation) return res.status(404).json({ error: "Operation not found" });

    if (req.ability?.cannot("update", subject("Operation", operation))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { name, operationCode, operationType, changeInventory, hasFinance } = req.body;

    await operation.update({
      name,
      operationCode,
      operationType,
      changeInventory,
      hasFinance
    });

    return res.json(operation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOperation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const operation = await Operation.findByPk(id);
    
    if (!operation) return res.status(404).json({ error: "Operation not found" });

    if (req.ability?.cannot("delete", subject("Operation", operation))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await operation.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
