import { Request, Response } from "express";
import prisma from "../config/database";

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        const movementId = req.query.movementId ? parseInt(req.query.movementId as string) : undefined;

        const where: any = {};
        if (movementId) {
            where.movementId = movementId;
        }

        const payments = await prisma.payment.findMany({
            where,
            include: {
                paymentMethod: true,
                movement: {
                    select: { stockMovementCode: true, totalAmount: true, balanceAmount: true }
                },
                createdBy: { select: { id: true, name: true } }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: offset,
            take: limit,
        });

        const total = await prisma.payment.count({ where });

        return res.json({
            data: payments,
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

export const getPayment = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id || 0);
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                paymentMethod: true,
                movement: true,
                accountEntries: {
                    include: { account: true }
                },
                createdBy: { select: { id: true, name: true } }
            }
        });

        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        return res.json(payment);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { movementId, amount, paymentMethodId, notes } = req.body;
        const userId = (req as any).user?.id;

        // Validation
        const movement = await prisma.movement.findUnique({ where: { id: movementId } });
        if (!movement) {
            return res.status(404).json({ error: "Movement not found" });
        }

        if (movement.movementType !== 'SALE') {
            return res.status(400).json({ error: "Payments can only be created for Sales" });
        }

        if (amount > Number(movement.balanceAmount)) {
            return res.status(400).json({ error: "Payment amount exceeds balance" });
        }

        const payment = await prisma.payment.create({
            data: {
                paymentCode: `PAY-${Date.now()}`,
                movementId,
                amount,
                paymentMethodId,
                notes,
                status: 'PENDING',
                createdById: userId
            }
        });

        return res.json(payment);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const confirmPayment = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id || 0);
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: { movement: true, paymentMethod: true }
        });

        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        if (payment.status !== 'PENDING') {
            return res.status(400).json({ error: "Payment is not pending" });
        }

        // Accounting Logic
        // 1. Debit Asset Account (Cash/Bank/Card)
        // 2. Credit Accounts Receivable

        // Find accounts (simplified for now - ideally mapped to payment methods)
        // Assuming standard accounts exist from seed
        let debitAccountCode = "1010"; // Default Cash
        const paymentMethodName = payment.paymentMethod.name.toLowerCase();

        if (paymentMethodName.includes('credit')) debitAccountCode = "1020";
        else if (paymentMethodName.includes('bank')) debitAccountCode = "1010"; // Treat as cash asset for now

        const debitAccount = await prisma.account.findUnique({ where: { accountCode: debitAccountCode } });
        const creditAccount = await prisma.account.findUnique({ where: { accountCode: "1030" } }); // Accounts Receivable

        if (!debitAccount || !creditAccount) {
            return res.status(500).json({ error: "Accounting configuration missing" });
        }

        const result = await prisma.$transaction(async (prisma) => {
            // 1. Update Payment Status
            const updatedPayment = await prisma.payment.update({
                where: { id },
                data: { status: 'CONFIRMED' }
            });

            // 2. Create Account Entries
            await prisma.accountEntry.create({
                data: {
                    accountId: debitAccount.id,
                    paymentId: id,
                    amount: payment.amount,
                    entryType: 'DEBIT',
                    description: `Payment ${payment.paymentCode} - ${payment.paymentMethod.name}`
                }
            });
            await prisma.account.update({
                where: { id: debitAccount.id },
                data: { balance: { increment: payment.amount } }
            });

            await prisma.accountEntry.create({
                data: {
                    accountId: creditAccount.id,
                    paymentId: id,
                    amount: payment.amount,
                    entryType: 'CREDIT',
                    description: `Payment ${payment.paymentCode} - AR Reduction`
                }
            });
            await prisma.account.update({
                where: { id: creditAccount.id },
                data: { balance: { decrement: payment.amount } }
            });

            // 3. Update Movement Balance
            const newPaidAmount = Number(payment.movement.paidAmount) + Number(payment.amount);
            const newBalance = Number(payment.movement.totalAmount) - newPaidAmount;

            let newStatus = payment.movement.status;
            if (newBalance <= 0) newStatus = 'PAID';
            else if (newPaidAmount > 0) newStatus = 'PARTIALLY_PAID';

            await prisma.movement.update({
                where: { id: payment.movementId },
                data: {
                    paidAmount: newPaidAmount,
                    balanceAmount: newBalance,
                    status: newStatus as any
                }
            });

            return updatedPayment;
        });

        return res.json(result);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const failPayment = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id || 0);
        const payment = await prisma.payment.update({
            where: { id },
            data: { status: 'FAILED' }
        });
        return res.json(payment);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
