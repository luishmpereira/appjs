import { Router } from "express";
import passport from "../config/passport";
import { validate } from "@/middlewares/validate";
import { registerSchema, loginSchema } from "./validations/authSchemas";
import { register, login, me } from "../controllers/authController";
import { authenticateJWT, authorize } from "../middlewares/auth";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post(
  "/login",
  validate(loginSchema),
  passport.authenticate("local", { session: false }),
  login
);

router.get("/me", authenticateJWT, me);

router.get("/admin", authenticateJWT, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

export default router;
