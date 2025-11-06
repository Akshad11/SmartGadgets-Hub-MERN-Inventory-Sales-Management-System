import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductMeta,
    getProductsByBrand
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/meta", getProductMeta);
router.get("/", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/brand/:brand", getProductsByBrand);
router.get("/:id", getProductById);

// Protected (Admin/Staff)
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
