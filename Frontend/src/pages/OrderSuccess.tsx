// src/pages/OrderSuccess.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomerLayout from "../layout/CustomerLayout";
import { CheckCircle } from "lucide-react";

const OrderSuccess: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;

    if (!order) {
        return (
            <CustomerLayout>
                <div className="flex justify-center items-center min-h-[80vh] text-gray-500">
                    ⚠️ No order details available.
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center items-center min-h-[80vh] from-blue-50 to-white px-6"
            >
                {/* ✅ Success Icon Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="bg-green-100 rounded-full p-6 mb-4 shadow-lg"
                >
                    <CheckCircle className="text-green-600 w-16 h-16" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-gray-800 mb-2"
                >
                    Order Placed Successfully!
                </motion.h1>

                <p className="text-gray-600 mb-8 text-center max-w-md">
                    Thank you for shopping with{" "}
                    <span className="font-semibold text-blue-600">SmartGadgets Hub</span>.<br />
                    We’ve received your order and will notify you once it’s shipped.
                </p>

                {/* 🧾 Order Summary */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg"
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                        Order Summary
                    </h3>

                    <div className="space-y-3 text-gray-700">
                        {order.orderItems?.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between border-b pb-1">
                                <span>
                                    {item.name} × {item.quantity}
                                </span>
                                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}

                        <div className="flex justify-between font-semibold mt-2">
                            <span>Total</span>
                            <span className="text-blue-600">
                                ₹{order.totalAmount.toLocaleString()}
                            </span>
                        </div>

                        {/* ✅ Properly formatted address */}
                        <div className="mt-4 text-sm text-gray-500">
                            <p>
                                <strong>Shipping:</strong>{" "}
                                {`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
                            </p>
                            <p>
                                <strong>Payment Method:</strong> {order.paymentMethod}
                            </p>
                            <p>
                                <strong>Status:</strong> {order.orderStatus || "Pending"}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* 🛍️ Continue Shopping */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/products")}
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                >
                    Continue Shopping
                </motion.button>
            </motion.div>
        </CustomerLayout>
    );
};

export default OrderSuccess;
