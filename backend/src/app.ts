import express from "express";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);

export default app;
