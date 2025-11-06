// src/pages/ProductDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CustomerLayout from "../layout/CustomerLayout";
import api from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import type { IProduct } from "../types";

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Failed to load product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = (product: IProduct) => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    if (loading)
        return (
            <CustomerLayout>
                <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
                    Loading product details...
                </div>
            </CustomerLayout>
        );

    if (!product)
        return (
            <CustomerLayout>
                <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
                    Product not found.
                </div>
            </CustomerLayout>
        );

    return (
        <CustomerLayout>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-center items-start gap-10 bg-white shadow-lg hover:shadow-2xl rounded-3xl p-8 md:p-12 mx-auto max-w-6xl mt-8 mb-16 min-h-[80vh] transition-all duration-300"
            >
                {/* 🖼️ Left: Product Image */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex-1 flex justify-center items-center"
                >
                    <div className="relative group">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full max-w-md rounded-2xl shadow-xl object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </motion.div>

                {/* 📄 Right: Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex-1 space-y-6"
                >
                    <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                        {product.name}
                    </h1>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>

                    <div className="flex flex-col gap-2 text-gray-700">
                        <span className="text-3xl font-semibold text-blue-600">
                            ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                            In Stock:{" "}
                            <span className="font-medium text-gray-700">
                                {product.stock > 0 ? product.stock : "Out of stock"}
                            </span>
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAddToCart(product)}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            🛒 Add to Cart
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                navigate("/buy-now", { state: { product } });
                            }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            ⚡ Buy Now
                        </motion.button>
                    </div>

                    {/* Added to Cart Animation */}
                    <AnimatePresence>
                        {added && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg font-medium"
                            >
                                ✅ Added to Cart!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </CustomerLayout>
    );
};

export default ProductDetails;
