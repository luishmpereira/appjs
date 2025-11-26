import { Request, Response } from "express";
import { Product } from "../models";
import { subject } from "@casl/ability";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({ 
        order: [["name", "ASC"]],
        limit,
        offset
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

// export const addStock = async (req: Request, res: Response) => {
//   const t = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const { quantity } = req.body;
//     const qty = parseInt(quantity);

//     if (isNaN(qty) || qty <= 0) {
//         await t.rollback();
//         return res.status(400).json({ error: "Invalid quantity" });
//     }

//     const product = await Product.findByPk(id, { transaction: t });
//     if (!product) {
//         await t.rollback();
//         return res.status(404).json({ error: "Product not found" });
//     }

//     if (req.ability?.cannot("update", subject("Product", product))) {
//         await t.rollback();
//         return res.status(403).json({ error: "Forbidden" });
//     }

//     product.stockQuantity += qty;
//     await product.save({ transaction: t });

//     await MovementLine.create({
//       productId: product.id,
//       quantity: qty,

//     }, { transaction: t });

//     await t.commit();
//     return res.json(product);
//   } catch (error: any) {
//     await t.rollback();
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const removeStock = async (req: Request, res: Response) => {
//   const t = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const { quantity, reason } = req.body;
//     const qty = parseInt(quantity);

//     if (isNaN(qty) || qty <= 0) {
//         await t.rollback();
//         return res.status(400).json({ error: "Invalid quantity" });
//     }

//     const product = await Product.findByPk(id, { transaction: t });
//     if (!product) {
//         await t.rollback();
//         return res.status(404).json({ error: "Product not found" });
//     }

//     if (req.ability?.cannot("update", subject("Product", product))) {
//         await t.rollback();
//         return res.status(403).json({ error: "Forbidden" });
//     }

//     if (product.stockQuantity < qty) {
//         await t.rollback();
//         return res.status(400).json({ error: "Insufficient stock" });
//     }

//     product.stockQuantity -= qty;
//     await product.save({ transaction: t });

//     await MovementLine.create({
//       productId: product.id,
//       quantity: qty
//     }, { transaction: t });

//     await t.commit();
//     return res.json(product);
//   } catch (error: any) {
//     await t.rollback();
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const getStockHistory = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const history = await MovementLine.findAll({
//       where: { productId: id },
//       include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
//       order: [["createdAt", "DESC"]],
//     });
//     return res.json(history);
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// };
