// src/pages/Staff/StaffProducts.tsx
import React, { useEffect, useState } from "react";
import StaffLayout from "../../layout/StaffLayout";
import { useAuth } from "../../hooks/useAuth";
import type { IProduct } from "../../types";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { motion, AnimatePresence } from "framer-motion";


const StaffProducts: React.FC = () => {
    const { token, user } = useAuth();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get<IProduct[]>("/products");
                setProducts(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [token]);

    const handleAddProduct = () => {
        navigate("/product/add");
    }

    const handleAddStock = () => {
        navigate(`/add-stock`);
    };

    const handleEditProduct = (id: string) => {
        navigate(`/product/edit/${id}`);
    };
    return (
        <StaffLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", path: "/staff/dashboard" },
                    { label: "Product" },
                ]}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">My Products</h1>
                <div className="flex gap-3">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                        onClick={() => handleAddStock()}>
                        🛒 Add Stock
                    </button>

                </div>
            </div>

            {loading ? (
                <div className="text-gray-500 text-center py-10">Loading your products...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-10">{error}</div>
            ) : (



                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full text-sm">
                        {/* Header */}
                        <thead className="bg-gradient-to-r from-blue-50 to-blue-100/60">
                            <tr>
                                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                    Product
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                    Category
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                    Stock
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                    Price (₹)
                                </th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <AnimatePresence>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((p, index) => (
                                    <motion.tr
                                        key={p._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            delay: index * 0.04,
                                            duration: 0.3,
                                            type: "spring",
                                            stiffness: 120,
                                        }}
                                        className="group cursor-pointer transition-all duration-300 hover:bg-blue-50/50 hover:shadow-sm hover:scale-[1.01]"
                                    >
                                        {/* 🖼️ Product with image */}
                                        <td className="px-5 py-3 text-gray-800 group-hover:text-blue-700 font-medium flex items-center gap-4 rounded-l-xl">
                                            <motion.img
                                                src={p.imageUrl}
                                                alt={p.name}
                                                className="w-12 h-12 rounded-md object-cover border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{p.name}</p>
                                                <p className="text-xs text-gray-500">{p.brand}</p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3 text-gray-600">{p.category}</td>

                                        {/* 🧮 Stock */}
                                        <td
                                            className={`px-5 py-3 font-medium ${p.stock < 10
                                                ? "text-red-500 bg-red-50/40 rounded-md"
                                                : "text-gray-700"
                                                }`}
                                        >
                                            {p.stock}
                                        </td>

                                        {/* 💰 Price */}
                                        <td className="px-5 py-3 font-semibold text-gray-800 rounded-r-xl">
                                            ₹{p.price.toLocaleString()}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </AnimatePresence>
                    </table>

                    {/* Empty State */}
                    <AnimatePresence>
                        {products.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-500 text-center py-10 text-base bg-gradient-to-b from-gray-50 to-white"
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
                                    alt="Empty"
                                    className="w-20 mx-auto mb-3 opacity-70"
                                />
                                You haven’t added any products yet.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>



            )}
        </StaffLayout>
    );
};

export default StaffProducts;
