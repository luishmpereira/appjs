import { Router } from "express";
import { 
    getAllMovements, 
    getMovement, 
    createMovement, 
    updateMovement, 
    deleteMovement
} from "../controllers/movementController";
import { authenticateJWT, checkAbility } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

// Using "Product" subject for now as generic inventory permission, or "Movement" if it exists in CASL
// Assuming "Movement" subject is valid or handled by wildcard
router.get("/", getAllMovements);
router.get("/:id", getMovement);
router.post("/", createMovement);
router.put("/:id", updateMovement);
router.delete("/:id", deleteMovement);

export default router;
