import { Router } from "express";
import { getAllUsers, createUser, updateUser, deleteUser } from "../controllers/userController";
import { authenticateJWT, checkAbility } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.get("/", checkAbility("manage", "User"), getAllUsers);
router.post("/", checkAbility("create", "User"), createUser);
router.put("/:id", checkAbility("update", "User"), updateUser);
router.delete("/:id", checkAbility("delete", "User"), deleteUser);

export default router;
