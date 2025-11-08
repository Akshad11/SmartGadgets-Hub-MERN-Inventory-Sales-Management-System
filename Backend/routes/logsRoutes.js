import express from "express";
import { getAllLogs, getExportPDF } from "../controllers/logsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧠 Admin-only logs route
router.get("/", protect, getAllLogs);
router.get("/export/pdf", protect, getExportPDF);

export default router;
