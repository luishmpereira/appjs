import { Request, Response } from "express";
import prisma from "../config/database";

export const getAllMovements = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const movements = await prisma.movement.findMany({
            orderBy: {
                createdAt: "desc"
            },
            skip: offset,
            take: limit,
        });
        return res.json({
            data: movements,
            meta: {
                total: movements.length,
                page,
                last_page: Math.ceil(movements.length / limit),
            }
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getMovement = async (req: Request, res: Response) => {
    try {
        const movement = await prisma.movement.findUnique({
            where: {
                id: +(req.params.id || 0)
            },
            select: { lines: { select: { product: true } } }
        });
        if (!movement) {
            return res.status(404).json({ error: "Movimento não encontrado" });
        }
        return res.json(movement);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createMovement = async (req: Request, res: Response) => {
    try {
        const { lines, ...movementData } = req.body;

        const movement = await prisma.movement.create(
            {
                data: {
                    ...movementData,
                    operationId: undefined,
                    createdById: undefined,
                    updatedById: undefined,
                    createdBy: {
                        connect: { id: movementData.createdBy }
                    },
                    updatedBy: {
                        connect: { id: movementData.updatedBy }
                    },
                    lines: {
                        create: lines
                    },
                    operation:{
                        connect: { id: movementData.operationId }
                    }
                } 
            }
        );

        return res.json(movement);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateMovement = async (req: Request, res: Response) => {
    try {
        const { lines, ...movementData } = req.body;
        const t = await prisma.$transaction([
            prisma.movement.update({
                where: { id: +(req.params.id || 0) },
                    data: {
                    ...movementData,
                    lines: {
                        create: lines
                    }
                }
            }),
        ]);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteMovement = async (req: Request, res: Response) => {
    try {
        const movement = await prisma.movement.findUnique({
            where: { id: +(req.params.id || 0) }
        });
        if (!movement) {
            return res.status(404).json({ error: "Movimento não encontrado" });
        }
        await prisma.movement.delete({
            where: { id: +(req.params.id || 0) }
        });
        return res.json({ message: "Movimento deletado" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
