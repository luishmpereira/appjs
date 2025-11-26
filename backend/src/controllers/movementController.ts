import { Request, Response } from "express";
import { Movement, MovementLine, sequelize } from "../models";

export const getAllMovements = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Movement.findAndCountAll({
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        });
        return res.json({
            data: rows,
            meta: {
                total: count,
                page,
                last_page: Math.ceil(count / limit),
            }
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getMovement = async (req: Request, res: Response) => {
    try {
        const movement = await Movement.findByPk(req.params.id, {
            include: [{ association: "lines", include: ["product"] }]
        });
        if (!movement) {
            return res.status(404).json({ error: "Movement not found" });
        }
        return res.json(movement);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createMovement = async (req: Request, res: Response) => {
    try {
        const { lines, ...movementData } = req.body;
        
        const movement = await Movement.create(
            {
                ...movementData,
                lines: lines
            },
            {
                include: [{ association: "lines" }]
            }
        );
        
        return res.json(movement);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateMovement = async (req: Request, res: Response) => {
    const t = await sequelize.transaction();
    try {
        const movement = await Movement.findByPk(req.params.id);
        if (!movement) {
            await t.rollback();
            return res.status(404).json({ error: "Movement not found" });
        }

        const { lines, ...movementData } = req.body;

        await movement.update(movementData, { transaction: t });

        if (lines && Array.isArray(lines)) {
            // Destroy existing lines
            await MovementLine.destroy({
                where: { movementId: movement.id },
                transaction: t
            });

            // Create new lines
            for (const line of lines) {
                await MovementLine.create({
                    ...line,
                    movementId: movement.id
                }, { transaction: t });
            }
        }

        await t.commit();
        
        // Refetch to return complete object
        const updatedMovement = await Movement.findByPk(movement.id, {
            include: [{ association: "lines" }]
        });
        
        return res.json(updatedMovement);
    } catch (error: any) {
        await t.rollback();
        return res.status(500).json({ error: error.message });
    }
};

export const deleteMovement = async (req: Request, res: Response) => {
    try {
        const movement = await Movement.findByPk(req.params.id);
        if (!movement) {
            return res.status(404).json({ error: "Movement not found" });
        }
        await movement.destroy();
        return res.json({ message: "Movement deleted" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
