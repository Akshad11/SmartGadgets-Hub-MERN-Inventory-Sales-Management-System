import Product from "../models/productModel.js";

// 🧠 CREATE Product (Admin only)
export const createProduct = async (req, res) => {
    const { name, description, brand, category, price, stock, imageUrl } = req.body;

    try {
        // Only Admin can add products
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Only admin can add products" });
        }

        const product = await Product.create({
            name,
            description,
            brand,
            category,
            price,
            stock,
            imageUrl,
            createdBy: req.user._id,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧠 READ All Products (Public)
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("createdBy", "name email role");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧠 READ Single Product (Public)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("createdBy", "name email role");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductMeta = async (req, res) => {
    try {

        const brands = await Product.distinct("brand");

        // Get distinct categories
        const categories = await Product.distinct("category");

        res.status(200).json({
            brands: brands.filter((b) => b && b.trim() !== "").sort(),
            categories: categories.filter((c) => c && c.trim() !== "").sort(),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductsByBrand = async (req, res) => {
    try {
        const { brand } = req.params;

        // Case-insensitive brand search
        const products = await Product.find({
            brand: { $regex: new RegExp(brand, "i") },
        }).populate("createdBy", "name email role");

        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found for brand '${brand}'` });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧠 READ Products by Category (Public)
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({
            category: { $regex: new RegExp(category, "i") },
        }).populate("createdBy", "name email role");

        if (!products.length) {
            return res.status(404).json({ message: `No products found in '${category}' category` });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧠 UPDATE Product (Admin only)
export const updateProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Access denied: Only admin can update products" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const fields = ["name", "description", "brand", "category", "price", "stock", "imageUrl"];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) product[field] = req.body[field];
        });

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧠 DELETE Product (Admin only)
export const deleteProduct = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Only admin can delete products" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
