// src/pages/CartCheckout.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import type { IOrder } from "../types";
import CustomerLayout from "../layout/CustomerLayout";

const CartCheckout: React.FC = () => {
    const { cart, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

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

    const handleInput = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        const newOrder: IOrder = {
            customer: user!.id,
            orderItems: cart.map((item) => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl,
            })),
            totalAmount,
            paymentMethod: formData.paymentMethod as IOrder["paymentMethod"],
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
            },
        };
        console.log("New Order:", newOrder);
        try {
            await api.post("/orders", newOrder);

            toast.success("✅ Order placed successfully!");
            clearCart();
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
                className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-lg mt-10 mb-10"
            >
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                    Checkout
                </h2>

                <div className="bg-gray-50 p-5 rounded-2xl mb-6 shadow-inner">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Order Summary
                    </h3>
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between border-b pb-2 text-gray-700"
                            >
                                <span>
                                    {item.name} × {item.quantity}
                                </span>
                                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-right mt-4 text-lg font-semibold">
                        Total: ₹{totalAmount.toLocaleString()}
                    </div>
                </div>

                {/* Address + Payment */}
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
                                type="email"
                                name="email"
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
                        onClick={handlePlaceOrder}
                        type="button"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        Place Order
                    </motion.button>
                </form>
            </motion.div>
        </CustomerLayout>
    );
};

export default CartCheckout;
