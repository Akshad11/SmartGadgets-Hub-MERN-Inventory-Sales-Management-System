import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { motion } from "framer-motion";
import type { IProduct } from "../types";

const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                const allProducts = res.data;

                // Pick 10 random unique products
                const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
                setProducts(shuffled.slice(0, 10));
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-white py-12 text-center text-gray-500 animate-pulse">
                Loading featured products...
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 py-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-gray-800">
                🌟 Featured Products
            </h2>

            {products.length === 0 ? (
                <p className="text-center text-gray-500">No featured products available.</p>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-x-auto scrollbar-hide"
                >
                    <div className="flex gap-6 px-6 py-2 min-w-max">
                        {products.map((p) => (
                            <motion.div
                                key={p._id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[220px] sm:min-w-[240px]"
                                onClick={() => (window.location.href = `/product/${p._id}`)}
                            >
                                <div className="relative w-full h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-800 truncate">{p.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{p.brand}</p>
                                    <p className="text-blue-600 font-semibold mt-1">
                                        ₹{p.price.toLocaleString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default FeaturedProducts;
