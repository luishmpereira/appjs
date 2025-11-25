import { Router } from "express";
import { 
    getAllOperations, 
    getOperation, 
    createOperation, 
    updateOperation, 
    deleteOperation
} from "../controllers/operationController";
import { authenticateJWT, checkAbility } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.get("/", checkAbility("read", "Operation"), getAllOperations);
router.get("/:id", checkAbility("read", "Operation"), getOperation);
router.post("/", checkAbility("create", "Operation"), createOperation);
router.put("/:id", checkAbility("update", "Operation"), updateOperation);
router.delete("/:id", checkAbility("delete", "Operation"), deleteOperation);

export default router;
