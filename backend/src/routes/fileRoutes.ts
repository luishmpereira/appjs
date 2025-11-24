import { Router } from "express";
import multer from "multer";
import { uploadFile, getFile } from "../controllers/fileController";
import { authenticateJWT, checkAbility } from "../middlewares/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public route to get files (or protected depending on needs)
router.get("/:key", getFile);

// Protected upload
router.post(
    "/upload", 
    authenticateJWT, 
    // checkAbility("create", "File"), // Define File subject if needed, or just use generic
    upload.single("file"), 
    uploadFile
);

export default router;
