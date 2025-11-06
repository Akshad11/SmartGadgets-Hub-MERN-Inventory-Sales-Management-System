import express from "express";
import {
    registerCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
} from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerCustomer);
router.get("/", protect, getAllCustomers);
router.get("/:id", protect, getCustomerById);
router.put("/:id", protect, updateCustomer);
router.delete("/:id", protect, deleteCustomer);

export default router;
