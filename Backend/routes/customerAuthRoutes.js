import express from "express";
import { loginCustomer, getCustomerProfile } from "../controllers/customerAuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/customer/login
router.post("/login", loginCustomer);

// GET /api/auth/customer/profile
router.get("/profile", protect, getCustomerProfile);

export default router;
