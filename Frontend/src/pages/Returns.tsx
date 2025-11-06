import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomerLayout from "../layout/CustomerLayout";
import { PackageCheck, PackageX, Send } from "lucide-react";

interface Order {
    id: string;
    productName: string;
    deliveredDate: string; // ISO string
}

const sampleOrders: Order[] = [
    {
        id: "ORD-101",
        productName: "Apple AirPods Pro",
        deliveredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
        id: "ORD-102",
        productName: "Samsung Galaxy S23",
        deliveredDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    },
];

const Returns: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [reason, setReason] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedOrder) return;

        const deliveryDate = new Date(selectedOrder.deliveredDate);
        const daysDiff = Math.floor((Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff > 15) {
            setIsExpired(true);
        } else {
            setSubmitted(true);
        }
    };

    const resetForm = () => {
        setSelectedOrder(null);
        setReason("");
        setSubmitted(false);
        setIsExpired(false);
    };

    return (
        <CustomerLayout>
            <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10 px-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold text-gray-800 mb-6"
                >
                    Return / Replace Product
                </motion.h1>

                <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg relative overflow-hidden">
                    <AnimatePresence>
                        {/* 🧾 Form Section */}
                        {!submitted && !isExpired && (
                            <motion.form
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Order
                                    </label>
                                    <select
                                        value={selectedOrder?.id || ""}
                                        onChange={(e) => {
                                            const order = sampleOrders.find((o) => o.id === e.target.value) || null;
                                            setSelectedOrder(order);
                                        }}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    >
                                        <option value="">Choose an order</option>
                                        {sampleOrders.map((order) => (
                                            <option key={order.id} value={order.id}>
                                                {order.productName} — Delivered on{" "}
                                                {new Date(order.deliveredDate).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Reason for Return
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Describe the issue with the product..."
                                        rows={3}
                                        required
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium flex justify-center items-center gap-2"
                                >
                                    <Send size={18} />
                                    Submit Return Request
                                </motion.button>
                            </motion.form>
                        )}

                        {/* ✅ Success Animation */}
                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-4">
                                    <motion.div
                                        initial={{ rotate: -180 }}
                                        animate={{ rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="bg-green-100 rounded-full p-6 shadow-lg"
                                    >
                                        <PackageCheck className="w-12 h-12 text-green-600" />
                                    </motion.div>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Return Request Submitted!
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    Our delivery executive will arrive soon to verify your product.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                                    onClick={resetForm}
                                >
                                    Return Another Product
                                </motion.button>
                            </motion.div>
                        )}

                        {/* ❌ Expired Animation */}
                        {isExpired && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-4">
                                    <motion.div
                                        initial={{ rotate: 180 }}
                                        animate={{ rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="bg-red-100 rounded-full p-6 shadow-lg"
                                    >
                                        <PackageX className="w-12 h-12 text-red-600" />
                                    </motion.div>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Return Window Expired
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    Sorry, this product was delivered more than <b>15 days ago</b> and
                                    cannot be returned.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="mt-5 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
                                    onClick={resetForm}
                                >
                                    Go Back
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Returns;
