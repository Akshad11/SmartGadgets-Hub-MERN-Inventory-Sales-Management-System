import express from "express";
import {
    registerStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
} from "../controllers/staffController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerStaff);
router.get("/", protect, getAllStaff);
router.get("/:id", protect, getStaffById);
router.put("/:id", protect, updateStaff);
router.delete("/:id", protect, deleteStaff);

export default router;
