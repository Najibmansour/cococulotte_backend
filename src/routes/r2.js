import { Router } from "express";
import * as r2 from "../controllers/r2.js";
import { authMiddleware } from "../middlewares/auth.js";

const r = Router();

// POST /r2/presign - Get a presigned URL for upload
r.post("/presign", authMiddleware, r2.presign);

// GET /r2/files - List uploaded files
r.get("/files", authMiddleware, r2.listFiles);

export default r;
