import { Router } from "express";
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from "../controllers/contactController";
import { authenticateJWT, checkAbility } from "../middlewares/auth";

const router = Router();

router.use(authenticateJWT);

router.get("/", checkAbility("read", "Contact"), getAllContacts);
router.get("/:id", checkAbility("read", "Contact"), getContactById);
router.post("/", checkAbility("create", "Contact"), createContact);
router.put("/:id", checkAbility("update", "Contact"), updateContact);
router.delete("/:id", checkAbility("delete", "Contact"), deleteContact);

export default router;
