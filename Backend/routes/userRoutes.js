import express from "express";
import { changeUserPassword, adminChangeUserPassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/reset-password/:id", protect, changeUserPassword);

router.put("/admin/reset-password/:id", protect, adminChangeUserPassword);

export default router;
