// src/pages/BuyNowCheckout.tsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import type { IOrder } from "../types";
import CustomerLayout from "../layout/CustomerLayout";

const BuyNowCheckout: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();
    const product = state?.product;

    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        phone: user?.phone || "",
        email: user?.email || "",
        paymentMethod: "COD",
    });

    if (!product)
        return (
            <CustomerLayout>
                <div className="flex justify-center items-center h-[80vh] text-gray-500">
                    ⚠️ No product selected for checkout.
                </div>
            </CustomerLayout>
        );

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        const newOrder: IOrder = {
            customer: user!.id,
            orderItems: [
                {
                    product: product._id,
                    name: product.name,
                    quantity: 1,
                    price: product.price,
                    imageUrl: product.imageUrl,
                },
            ],
            totalAmount: product.price,
            paymentMethod: formData.paymentMethod as IOrder["paymentMethod"],
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
            },
        };

        try {
            await api.post("/orders", newOrder);

            toast.success(`✅ Order placed for ${product.name}`);
            navigate("/order-success", { state: { order: newOrder } });
        } catch (err) {
            console.error("❌ Order creation failed:", err);
            toast.error("Failed to place order. Please try again.");
        }
    };

    return (
        <CustomerLayout>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-lg mt-10 mb-10"
            >
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                    Buy Now Checkout
                </h2>

                {/* Product Summary */}
                <div className="flex items-center gap-5 bg-blue-50 p-4 rounded-2xl mb-6 shadow-inner">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover shadow-md"
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.category}</p>
                        <p className="text-blue-600 font-bold mt-1 text-lg">
                            ₹{product.price.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Address Form */}
                <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Address</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleInput}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">City</label>
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleInput}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">State</label>
                            <input
                                name="state"
                                value={formData.state}
                                onChange={handleInput}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Postal Code</label>
                            <input
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInput}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Country</label>
                            <input
                                name="country"
                                value={formData.country}
                                onChange={handleInput}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleInput}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInput}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-gray-700 mb-1">Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleInput}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="UPI">UPI</option>
                            <option value="Net Banking">Net Banking</option>
                        </select>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handlePlaceOrder}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        Place Order
                    </motion.button>
                </form>
            </motion.div>
        </CustomerLayout>
    );
};

export default BuyNowCheckout;
