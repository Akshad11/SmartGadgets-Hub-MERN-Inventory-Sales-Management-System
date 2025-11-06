// src/components/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { IProduct } from "../types";

const SProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
    return (
        <div className="bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between">
                <h3 className="text-lg font-semibold line-clamp-1">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.category}</p>
                <p className="text-blue-600 font-bold mt-2 text-lg">
                    ₹{product.price.toLocaleString()}
                </p>
                <Link
                    to={`/product/${product._id}`}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default SProductCard;
