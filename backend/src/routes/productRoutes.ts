import { Router } from "express";
import { 
    getAllProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    addStock,
    removeStock,
    getStockHistory
} from "../controllers/productController";
import { authenticateJWT, checkAbility } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.get("/", checkAbility("read", "Product"), getAllProducts);
router.get("/:id", checkAbility("read", "Product"), getProduct);
router.post("/", checkAbility("create", "Product"), createProduct);
router.put("/:id", checkAbility("update", "Product"), updateProduct);
router.delete("/:id", checkAbility("delete", "Product"), deleteProduct);

// Stock operations
router.post("/:id/stock/in", checkAbility("update", "Product"), addStock);
router.post("/:id/stock/out", checkAbility("update", "Product"), removeStock);
router.get("/:id/history", checkAbility("read", "Product"), getStockHistory);

export default router;
