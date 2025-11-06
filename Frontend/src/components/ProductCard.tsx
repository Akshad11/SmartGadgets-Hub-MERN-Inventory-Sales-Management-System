import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { IProduct } from "../types";
import { ShoppingCart, Eye } from "lucide-react";

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
        >
            {/* Product Image */}
            <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Link
                        to={`/product/${product._id}`}
                        className="bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </Link>
                    <button
                        className="bg-white text-green-600 p-2 rounded-full shadow-md hover:bg-green-600 hover:text-white transition"
                        title="Add to Cart"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-grow p-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                    {product.brand || "Unknown Brand"} • {product.category}
                </p>

                <div className="mt-auto flex justify-between items-center">
                    <span className="text-blue-600 font-semibold text-lg">
                        ₹{product.price.toLocaleString()}
                    </span>

                    <Link
                        to={`/product/${product._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition-all duration-200"
                    >
                        View
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
