import { Router } from "express";
import {
    getAllMovements,
    getMovement,
    createMovement,
    updateMovement,
    deleteMovement,
    sendQuotation,
    acceptQuotation,
    cancelMovement
} from "../controllers/movementController";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.get("/", getAllMovements);
router.get("/:id", getMovement);
router.post("/", createMovement);
router.put("/:id", updateMovement);
router.delete("/:id", deleteMovement);

// Status transitions
router.post("/:id/send", sendQuotation);
router.post("/:id/accept", acceptQuotation);
router.post("/:id/cancel", cancelMovement);

export default router;
