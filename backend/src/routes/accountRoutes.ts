import { Router } from "express";
import {
    getAllAccounts,
    getAccount,
    createAccount
} from "../controllers/accountController";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.get("/", getAllAccounts);
router.get("/:id", getAccount);
router.post("/", createAccount);

export default router;
