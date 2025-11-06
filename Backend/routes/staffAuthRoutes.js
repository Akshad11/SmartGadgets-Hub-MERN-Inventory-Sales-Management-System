import express from "express";
import { loginStaff, getStaffProfile } from "../controllers/staffAuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/staff/login
router.post("/login", loginStaff);

// GET /api/auth/staff/profile
router.get("/profile", protect, getStaffProfile);

export default router;
