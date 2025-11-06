import express from "express";
import { getDashboardStats } from "../controllers/statsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getStaffStats } from "../controllers/statsController.js";

const router = express.Router();

// GET /api/stats/admin-dashboard (Admin only)
router.get("/admin-dashboard", protect, getDashboardStats);


router.get("/staff-dashboard", protect, getStaffStats);

export default router;
