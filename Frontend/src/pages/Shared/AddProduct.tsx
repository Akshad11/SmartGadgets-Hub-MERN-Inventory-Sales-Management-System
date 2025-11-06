import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import type { IProduct } from "../../types";
import Breadcrumb from "../../components/Breadcrumb";
import { PlusCircle, Loader2 } from "lucide-react";

const AddProduct: React.FC = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Omit<IProduct, "_id" | "createdBy">>({
        name: "",
        description: "",
        brand: "",
        category: "",
        price: 0,
        stock: 0,
        imageUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [customBrand, setCustomBrand] = useState(false);
    const [customCategory, setCustomCategory] = useState(false);

    const brandOptions = ["Apple", "Samsung", "Sony", "Dell", "HP", "Lenovo", "Other"];
    const categoryOptions = ["Smartphones", "Laptops", "Audio", "Accessories", "Home Appliances", "Other"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" || name === "stock" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/products", { ...formData }, { headers: { Authorization: `Bearer ${token}` } });
            setSuccess("✅ Product added successfully!");
            setTimeout(() => {
                navigate(user?.role === "admin" ? "/admin/products" : "/staff/products");
            }, 1200);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4">
            <div className="max-w-5xl mx-auto mb-6">
                <Breadcrumb
                    items={[
                        { label: "Dashboard", path: "/admin/dashboard" },
                        { label: "Products", path: "/admin/products" },
                        { label: "Add Product" },
                    ]}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-100"
            >
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-semibold text-center text-gray-800 mb-6"
                >
                    <PlusCircle className="inline mr-2 text-blue-600" /> Add New Product
                </motion.h2>

                {error && <p className="text-red-500 text-center mb-3">{error}</p>}
                {success && <p className="text-green-600 text-center mb-3">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Enter short product details"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                        ></textarea>
                    </div>

                    {/* Brand & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Brand</label>
                            {!customBrand ? (
                                <select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={(e) =>
                                        e.target.value === "Other" ? setCustomBrand(true) : handleChange(e)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                >
                                    <option value="">Select brand</option>
                                    {brandOptions.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="Enter custom brand name"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Category</label>
                            {!customCategory ? (
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) =>
                                        e.target.value === "Other" ? setCustomCategory(true) : handleChange(e)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                >
                                    <option value="">Select category</option>
                                    {categoryOptions.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="Enter custom category"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                />
                            )}
                        </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min={0}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min={0}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    {/* Image URL + Preview */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                        />
                        {formData.imageUrl && (
                            <motion.img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="w-40 h-40 object-cover rounded-xl shadow-md mt-4 mx-auto border border-gray-200"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        )}
                    </div>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <PlusCircle />}
                        {loading ? "Adding Product..." : "Add Product"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddProduct;
