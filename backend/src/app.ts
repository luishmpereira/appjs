import express from "express";
import cors from "cors";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import fileRoutes from "./routes/fileRoutes";
import roleRoutes from "./routes/roleRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/files", fileRoutes);
app.use("/roles", roleRoutes);
app.use("/products", productRoutes);

export default app;
