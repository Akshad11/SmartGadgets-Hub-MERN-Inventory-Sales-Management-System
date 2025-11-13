import express from "express";
import { loginStaff, getStaffProfile, changeStaffPassword } from "../controllers/staffAuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/staff/login
router.post("/login", loginStaff);

// GET /api/auth/staff/profile
router.get("/profile", protect, getStaffProfile);

//
router.put("/change-password", protect, changeStaffPassword);

export default router;
