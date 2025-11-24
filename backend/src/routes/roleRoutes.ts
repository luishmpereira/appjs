import { Router } from "express";
import { getAllRoles, createRole, updateRole, deleteRole } from "../controllers/roleController";
import { authenticateJWT, checkAbility } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

// Use "Role" as subject. Admin has "manage all", so they can access.
router.get("/", checkAbility("read", "Role"), getAllRoles);
router.post("/", checkAbility("create", "Role"), createRole);
router.put("/:id", checkAbility("update", "Role"), updateRole);
router.delete("/:id", checkAbility("delete", "Role"), deleteRole);

export default router;
