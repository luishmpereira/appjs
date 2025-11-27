import { Request, Response } from "express";
import { subject } from "@casl/ability";
import prisma from "@/config/database";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      take: limit,
      skip: offset
    });
    return res.json({
      data: products,
      meta: {
        total: products.length,
        page,
        last_page: Math.ceil(products.length / limit),
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: +(id || 0) },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Permissions check done in route or here? Route is better for generic checks, but let's keep consistency.
    // Route will check 'create', 'Product'.

    const { name, description, price, minStockLevel, image } = req.body;

    // Initial stock is 0. Use stock adjustment to add stock to have history.
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stockQuantity: 0
      },
    });

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: +(id || 0) },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    // ABAC check
    if (req.ability?.cannot("update", subject("Product", product))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { name, description, price, minStockLevel, image } = req.body;

    await prisma.product.update({
      where: { id: +(id || 0) },
      data: {
        name,
        description,
        price,
      },
    });

    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: +(id || 0) },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    if (req.ability?.cannot("delete", subject("Product", product))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.product.delete({
      where: { id: +(id || 0) },
    });
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
