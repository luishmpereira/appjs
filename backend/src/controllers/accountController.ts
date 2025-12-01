import { Request, Response } from "express";
import prisma from "../config/database";

export const getAllAccounts = async (req: Request, res: Response) => {
    try {
        const accounts = await prisma.account.findMany({
            where: { isActive: true },
            orderBy: { accountCode: "asc" }
        });
        return res.json(accounts);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAccount = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id || 0);
        const account = await prisma.account.findUnique({
            where: { id },
            include: {
                entries: {
                    take: 50,
                    orderBy: { createdAt: "desc" },
                    include: {
                        payment: { select: { paymentCode: true } },
                        movement: { select: { stockMovementCode: true } }
                    }
                }
            }
        });

        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }

        return res.json(account);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createAccount = async (req: Request, res: Response) => {
    try {
        const { accountCode, name, accountType } = req.body;

        const account = await prisma.account.create({
            data: {
                accountCode,
                name,
                accountType,
                balance: 0
            }
        });

        return res.json(account);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
