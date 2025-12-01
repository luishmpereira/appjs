import { Router } from "express";
import {
    getAllPayments,
    getPayment,
    createPayment,
    confirmPayment,
    failPayment
} from "../controllers/paymentController";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.get("/", getAllPayments);
router.get("/:id", getPayment);
router.post("/", createPayment);
router.post("/:id/confirm", confirmPayment);
router.post("/:id/fail", failPayment);

export default router;
