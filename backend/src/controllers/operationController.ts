import { Request, Response } from "express";
import { subject } from "@casl/ability";
import prisma from '../config/database';

export const getAllOperations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const operations = await prisma.operation.findMany({ 
        orderBy: { name: "asc" },
        skip: offset,
        take: limit
    });
    return res.json({
        data: operations,
        meta: {
            total: operations.length,
            page,
            last_page: Math.ceil(operations.length / limit),
        }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getOperation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const operation = await prisma.operation.findUnique({
      where: { id: +(id || 0) }
    });
    if (!operation) return res.status(404).json({ error: "Operation not found" });
    return res.json(operation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createOperation = async (req: Request, res: Response) => {
  try {
    const { name, operationCode, operationType, changeInventory, hasFinance } = req.body;
    
    const operation = await prisma.operation.create({
      data: {
        name,
        operationCode,
        operationType,
        changeInventory,
        hasFinance
      }
    });

    return res.status(201).json(operation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateOperation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const operation = await prisma.operation.findUnique({
      where: { id: +(id || 0) }
    });
    
    if (!operation) return res.status(404).json({ error: "Operation not found" });

    if (req.ability?.cannot("update", subject("Operation", operation))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { name, operationCode, operationType, changeInventory, hasFinance } = req.body;

    await prisma.operation.update({
      where: { id: +(id || 0) },
      data: {
        name,
        operationCode,
        operationType,
        changeInventory,
        hasFinance
      }
    });

    return res.json(operation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOperation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const operation = await prisma.operation.findUnique({
      where: { id: +(id || 0) }
    });
    
    if (!operation) return res.status(404).json({ error: "Operation not found" });

    if (req.ability?.cannot("delete", subject("Operation", operation))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.operation.delete({
      where: { id: +(id || 0) }
    });
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
