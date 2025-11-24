import { Router } from "express";
import passport from "../config/passport";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "./validations/authSchemas";
import { register, login, me, checkSetup, setupAdmin } from "../controllers/authController";
import { authenticateJWT, checkAbility } from "../middlewares/auth";

const router = Router();

router.get("/setup", checkSetup);
router.post("/setup", validate(registerSchema), setupAdmin);
router.post("/register", validate(registerSchema), register);

router.post(
  "/login",
  validate(loginSchema),
  passport.authenticate("local", { session: false }),
  login
);

router.get("/me", authenticateJWT, me);

router.get("/admin", authenticateJWT, checkAbility("manage", "all"), (req, res) => {
  res.json({ message: "Welcome admin" });
});

export default router;
