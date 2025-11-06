import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const colorGradients = [
    "from-purple-50 to-purple-100",
    "from-green-50 to-green-100",
    "from-pink-50 to-pink-100",
    "from-yellow-50 to-yellow-100",
    "from-blue-50 to-blue-100",
    "from-indigo-50 to-indigo-100",
    "from-orange-50 to-orange-100",
];

const CategorySlider: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/products/meta");
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="bg-white py-10 text-center text-gray-500 animate-pulse">
                Loading categories...
            </div>
        );
    }

    return (
        <div className="bg-white py-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-gray-800">
                Shop by Category
            </h2>

            {categories.length === 0 ? (
                <p className="text-center text-gray-500">No categories found.</p>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="overflow-x-auto"
                >
                    <div className="flex gap-6 px-6 py-2 min-w-max">
                        {categories.map((category, index) => {
                            const gradient = colorGradients[index % colorGradients.length];
                            return (
                                <motion.div
                                    key={category}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}

                                    onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}

                                    className={`min-w-[160px] h-[120px] bg-gradient-to-br ${gradient} 
                    flex flex-col justify-center items-center rounded-2xl shadow-md hover:shadow-lg 
                    transition-all duration-300 cursor-pointer`}
                                >
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm mb-2">
                                        <img
                                            src={`https://api.dicebear.com/8.x/icons/svg?seed=${category}`}
                                            alt={category}
                                            className="w-8 h-8 opacity-80"
                                        />
                                    </div>
                                    <p className="text-gray-700 font-medium text-sm">{category}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default CategorySlider;
