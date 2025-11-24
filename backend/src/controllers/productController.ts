import { Request, Response } from "express";
import { Product, StockMovement, User } from "../models";
import { subject } from "@casl/ability";
import { sequelize } from "../models";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({ order: [["name", "ASC"]] });
    return res.json(products);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
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
    const product = await Product.create({
      name,
      description,
      price,
      minStockLevel: minStockLevel || 0,
      stockQuantity: 0, 
      image,
    });

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) return res.status(404).json({ error: "Product not found" });

    // ABAC check
    if (req.ability?.cannot("update", subject("Product", product))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { name, description, price, minStockLevel, image } = req.body;

    await product.update({
      name,
      description,
      price,
      minStockLevel,
      image,
    });

    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (req.ability?.cannot("delete", subject("Product", product))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await product.destroy();
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Stock Operations

export const addStock = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { quantity, reason } = req.body;
    const qty = parseInt(quantity);

    if (isNaN(qty) || qty <= 0) {
        await t.rollback();
        return res.status(400).json({ error: "Invalid quantity" });
    }

    const product = await Product.findByPk(id, { transaction: t });
    if (!product) {
        await t.rollback();
        return res.status(404).json({ error: "Product not found" });
    }

    // Check permissions? usually "update" or specific "stock_in"
    // Let's assume if you can update product or have 'manage' 'Stock'
    // For now, let's check "update" "Product"
    if (req.ability?.cannot("update", subject("Product", product))) {
        await t.rollback();
        return res.status(403).json({ error: "Forbidden" });
    }

    product.stockQuantity += qty;
    await product.save({ transaction: t });

    await StockMovement.create({
      productId: product.id,
      type: "IN",
      quantity: qty,
      reason,
      userId: (req.user as User).id
    }, { transaction: t });

    await t.commit();
    return res.json(product);
  } catch (error: any) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

export const removeStock = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { quantity, reason } = req.body;
    const qty = parseInt(quantity);

    if (isNaN(qty) || qty <= 0) {
        await t.rollback();
        return res.status(400).json({ error: "Invalid quantity" });
    }

    const product = await Product.findByPk(id, { transaction: t });
    if (!product) {
        await t.rollback();
        return res.status(404).json({ error: "Product not found" });
    }

    if (req.ability?.cannot("update", subject("Product", product))) {
        await t.rollback();
        return res.status(403).json({ error: "Forbidden" });
    }

    if (product.stockQuantity < qty) {
        await t.rollback();
        return res.status(400).json({ error: "Insufficient stock" });
    }

    product.stockQuantity -= qty;
    await product.save({ transaction: t });

    await StockMovement.create({
      productId: product.id,
      type: "OUT",
      quantity: qty,
      reason,
      userId: (req.user as User).id
    }, { transaction: t });

    await t.commit();
    return res.json(product);
  } catch (error: any) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
};

export const getStockHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const history = await StockMovement.findAll({
      where: { productId: id },
      include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(history);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
