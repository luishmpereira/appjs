import express, { NextFunction } from "express";
import domain from "domain";
import cors from "cors";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import fileRoutes from "./routes/fileRoutes";
import roleRoutes from "./routes/roleRoutes";
import productRoutes from "./routes/productRoutes";
import operationRoutes from "./routes/operationRoutes";
import movementRoutes from "./routes/movementRoutes";
import contactRoutes from "./routes/contactRoutes";
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/files", fileRoutes);
app.use("/roles", roleRoutes);
app.use("/products", productRoutes);
app.use("/operations", operationRoutes);
app.use("/movements", movementRoutes);
app.use("/contacts", contactRoutes);

export default app;
