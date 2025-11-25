import { Router } from "express";
import { 
    getAllMovementLines, 
    getMovementLine, 
    createMovementLine, 
    updateMovementLine, 
    deleteMovementLine
} from "../controllers/movementLineController";
import { authenticateJWT, checkAbility } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.get("/", checkAbility("read", "MovementLine"), getAllMovementLines);
router.get("/:id", checkAbility("read", "MovementLine"), getMovementLine);
router.post("/", checkAbility("create", "MovementLine"), createMovementLine);
router.put("/:id", checkAbility("update", "MovementLine"), updateMovementLine);
router.delete("/:id", checkAbility("delete", "MovementLine"), deleteMovementLine);

export default router;
