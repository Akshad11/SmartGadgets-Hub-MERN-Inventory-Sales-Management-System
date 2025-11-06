import express from "express";
import { resetUserPassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Unified route for both Staff & Customer
router.put("/reset-password/:id", protect, resetUserPassword);

export default router;
