import { Request, Response } from "express";
import prisma from "../config/database";

export const getAllMovements = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        const type = req.query.type as string; // "QUOTATION", "SALE", "IN", "OUT"

        const where: any = {};
        if (type) {
            where.movementType = type;
        }

        const movements = await prisma.movement.findMany({
            where,
            include: {
                contact: true,
                operation: true,
                createdBy: { select: { id: true, name: true } }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: offset,
            take: limit,
        });

        const total = await prisma.movement.count({ where });

        return res.json({
            data: movements,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
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
            include: {
                lines: {
                    include: {
                        product: true
                    }
                },
                contact: true,
                operation: true,
                payments: {
                    include: {
                        paymentMethod: true,
                        createdBy: { select: { id: true, name: true } }
                    }
                },
                convertedTo: true,
                convertedFrom: true,
                createdBy: { select: { id: true, name: true } }
            }
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
        const userId = (req as any).user?.id; // Assuming auth middleware populates this

        // Basic validation
        if (!movementData.operationId) {
            return res.status(400).json({ error: "Operation ID is required" });
        }

        // Fetch operation to determine type and behavior
        const operation = await prisma.operation.findUnique({
            where: { id: movementData.operationId }
        });

        if (!operation) {
            return res.status(400).json({ error: "Invalid Operation ID" });
        }

        // Auto-generate code if not provided (simple timestamp based for now, can be improved)
        if (!movementData.stockMovementCode) {
            const prefix = operation.operationCode || "MOV";
            movementData.stockMovementCode = `${prefix}-${Date.now()}`;
        }

        // Set movement type from operation if not provided
        if (!movementData.movementType) {
            movementData.movementType = operation.operationType;
        }

        // Calculate totals if lines provided
        let calculatedTotal = 0;
        const linesToCreate = lines?.map((line: any) => {
            const subtotal = line.unitPrice && line.quantity
                ? line.unitPrice * line.quantity
                : 0;
            calculatedTotal += subtotal;
            return {
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                subtotal: subtotal
            };
        });

        if (movementData.movementType === 'QUOTATION' || movementData.movementType === 'SALE') {
            if (!movementData.contactId) {
                return res.status(400).json({ error: "Contact is required for Quotations and Sales" });
            }
            // Ensure totals are set
            if (!movementData.totalAmount) {
                movementData.totalAmount = calculatedTotal;
            }
            if (movementData.movementType === 'SALE') {
                movementData.balanceAmount = movementData.totalAmount - (movementData.paidAmount || 0);
            }
        }

        const movement = await prisma.movement.create({
            data: {
                ...movementData,
                createdById: userId,
                updatedById: userId,
                lines: {
                    create: linesToCreate
                }
            },
            include: {
                lines: true
            }
        });

        return res.json(movement);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

export const updateMovement = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id || 0);
        const { lines, ...movementData } = req.body;
        const userId = (req as any).user?.id;

        // Check if movement exists and is editable
        const existingMovement = await prisma.movement.findUnique({ where: { id } });
        if (!existingMovement) {
            return res.status(404).json({ error: "Movement not found" });
        }

        // Prevent updates to finalized movements (logic can be refined)
        if (['PAID', 'FULFILLED', 'CANCELED'].includes(existingMovement.status)) {
            return res.status(400).json({ error: "Cannot update finalized movement" });
        }

        // Transaction to update movement and lines
        const result = await prisma.$transaction(async (prisma) => {
            // 1. Update Movement details
            const updatedMovement = await prisma.movement.update({
                where: { id },
                data: {
                    ...movementData,
                    updatedById: userId
                }
            });

            // 2. Handle Lines (Delete all and recreate - simplest approach for now)
            if (lines) {
                await prisma.movementLine.deleteMany({ where: { movementId: id } });

                const linesToCreate = lines.map((line: any) => ({
                    movementId: id,
                    productId: line.productId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    subtotal: (line.unitPrice || 0) * line.quantity
                }));

                await prisma.movementLine.createMany({ data: linesToCreate });

                // Recalculate total if it's a sale/quotation
                if (updatedMovement.movementType === 'QUOTATION' || updatedMovement.movementType === 'SALE') {
                    const newTotal = linesToCreate.reduce((sum: number, line: any) => sum + line.subtotal, 0);
                    await prisma.movement.update({
                        where: { id },
                        data: {
                            totalAmount: newTotal,
                            balanceAmount: newTotal - (Number(updatedMovement.paidAmount) || 0)
                        }
                    });
                }
            }

            return updatedMovement;
        });

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteMovement = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id || 0);
        const movement = await prisma.movement.findUnique({ where: { id } });

        if (!movement) {
            return res.status(404).json({ error: "Movement not found" });
        }

        if (movement.status !== 'DRAFT' && movement.status !== 'PENDING') {
            return res.status(400).json({ error: "Cannot delete non-draft movement" });
        }

        await prisma.movement.delete({ where: { id } });
        return res.json({ message: "Movement deleted" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

// --- Status Transitions ---

export const sendQuotation = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id || 0);
        const movement = await prisma.movement.update({
            where: { id },
            data: { status: 'SENT' }
        });
        return res.json(movement);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const acceptQuotation = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id || 0);
        const userId = (req as any).user?.id;

        const quotation = await prisma.movement.findUnique({
            where: { id },
            include: { lines: true }
        });

        if (!quotation || quotation.movementType !== 'QUOTATION') {
            return res.status(404).json({ error: "Quotation not found" });
        }

        // Create Sale Order from Quotation
        const saleOperation = await prisma.operation.findFirst({ where: { operationCode: 'SALE' } });

        const result = await prisma.$transaction(async (prisma) => {
            // 1. Update Quotation status
            await prisma.movement.update({
                where: { id },
                data: { status: 'ACCEPTED' }
            });

            // 2. Create Sale Order
            const saleOrder = await prisma.movement.create({
                data: {
                    stockMovementCode: `SALE-${Date.now()}`,
                    movementType: 'SALE',
                    operationId: saleOperation?.id || quotation.operationId, // Fallback
                    contactId: quotation.contactId!,
                    totalAmount: quotation.totalAmount,
                    paidAmount: 0,
                    balanceAmount: quotation.totalAmount,
                    status: 'PENDING',
                    convertedFrom: { connect: { id: quotation.id } },
                    createdById: userId,
                    updatedById: userId,
                    lines: {
                        create: quotation.lines.map(l => ({
                            productId: l.productId,
                            quantity: l.quantity,
                            unitPrice: l.unitPrice,
                            subtotal: l.subtotal
                        }))
                    }
                }
            });

            // Link quotation to sale
            await prisma.movement.update({
                where: { id: quotation.id },
                data: { convertedToId: saleOrder.id }
            });

            return saleOrder;
        });

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const cancelMovement = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id || 0);
        const movement = await prisma.movement.update({
            where: { id },
            data: { status: 'CANCELED' }
        });
        return res.json(movement);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

