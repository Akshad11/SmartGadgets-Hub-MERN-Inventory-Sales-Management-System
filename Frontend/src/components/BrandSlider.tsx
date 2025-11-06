import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BrandSlider: React.FC = () => {
    const [brands, setBrands] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await api.get("/products/meta");
                setBrands(res.data.brands || []);
            } catch (err) {
                console.error("Failed to load brands:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

    const colorClasses = [
        "from-blue-50 to-blue-100",
        "from-gray-100 to-gray-200",
        "from-red-50 to-red-100",
        "from-orange-50 to-orange-100",
        "from-green-50 to-green-100",
        "from-indigo-50 to-indigo-100",
        "from-sky-50 to-sky-100",
    ];

    if (loading) {
        return (
            <div className="bg-white py-10 text-center text-gray-500 animate-pulse">
                Loading featured brands...
            </div>
        );
    }

    return (
        <div className="bg-white py-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-gray-800">
                Featured Brands
            </h2>

            {brands.length === 0 ? (
                <p className="text-center text-gray-500">No brands found.</p>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="overflow-x-auto"
                >
                    <div className="flex gap-6 px-6 py-2 min-w-max">
                        {brands.map((brand, index) => {
                            const gradient = colorClasses[index % colorClasses.length];
                            return (
                                <motion.div
                                    key={brand}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`min-w-[160px] h-[120px] bg-gradient-to-br ${gradient}
                    flex flex-col justify-center items-center rounded-2xl shadow-md hover:shadow-lg 
                    transition-all duration-300 cursor-pointer`}
                                    onClick={() => navigate(`/products?brand=${encodeURIComponent(brand)}`)}
                                >
                                    <div className="w-20 h-10 flex items-center justify-center mb-2"
                                    >
                                        <img
                                            src={`https://api.dicebear.com/8.x/initials/svg?seed=${brand}`}
                                            alt={brand}
                                            className="max-h-10 object-contain"
                                        />
                                    </div>
                                    <p className="text-gray-700 font-medium text-sm">{brand}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div >
            )}
        </div >
    );
};

export default BrandSlider;
