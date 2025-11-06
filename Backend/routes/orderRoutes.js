import express from "express";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧾 Customer Checkout
router.post("/", protect, createOrder);

// 🧾 Get orders of logged-in customer
router.get("/my-orders", protect, getMyOrders);

// 🧾 Admin-only Routes
router.get("/", protect, getAllOrders);
router.put("/:id", protect, updateOrderStatus);
router.delete("/:id", protect, deleteOrder);

export default router;
