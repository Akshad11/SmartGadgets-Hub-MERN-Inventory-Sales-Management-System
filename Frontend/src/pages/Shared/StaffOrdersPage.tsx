// src/pages/staff/StaffOrdersPage.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import api from "../../api/axiosInstance"; // your axios instance
import StaffLayout from "../../layout/StaffLayout";

interface Order {
    _id: string;
    totalAmount: number;
    orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    createdAt: string;
    customer: {
        name: string;
        email: string;
    };
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        postalCode: string;
    };
    orderItems: {
        name: string;
        quantity: number;
        price: number;
    }[];
}

const StaffOrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"pending" | "completed" | "cancelled">("pending");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders");
                setOrders(res.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((o) => {
        if (activeTab === "pending") return o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled";
        if (activeTab === "completed") return o.orderStatus === "Delivered";
        if (activeTab === "cancelled") return o.orderStatus === "Cancelled";
        return false;
    });

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await api.put(`/orders/${id}`, { orderStatus: newStatus, paymentStatus: newStatus === "Cancelled" ? "Failed" : "Paid" });
            setOrders((prev) =>
                prev.map((o) => (o._id === id ? { ...o, orderStatus: newStatus as any } : o))
            );
        } catch (err) {
            console.error("Failed to update order:", err);
        }
    };

    return (
        <StaffLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">🧾 Manage Orders</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b pb-2">
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-4 py-2 rounded-t-lg font-medium transition ${activeTab === "pending"
                            ? "bg-blue-600 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        🆕 Pending / New
                    </button>
                    <button
                        onClick={() => setActiveTab("completed")}
                        className={`px-4 py-2 rounded-t-lg font-medium transition ${activeTab === "completed"
                            ? "bg-green-600 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        ✅ Completed
                    </button>
                    <button
                        onClick={() => setActiveTab("cancelled")}
                        className={`px-4 py-2 rounded-t-lg font-medium transition ${activeTab === "cancelled"
                            ? "bg-red-600 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        ❌ Cancelled
                    </button>
                </div>

                {/* Orders Table */}
                {loading ? (
                    <div className="text-center text-gray-500 py-10">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        No {activeTab} orders found.
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-x-auto"
                        >
                            <table className="min-w-full bg-white rounded-xl shadow">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Order ID</th>
                                        <th className="px-4 py-3 text-left">Customer</th>
                                        <th className="px-4 py-3 text-left">Amount</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Date</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr
                                            key={order._id}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-800">{order.customer?.name}</p>
                                                    <p className="text-xs text-gray-500">{order.customer?.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-blue-600">
                                                ₹{order.totalAmount.toLocaleString()}
                                            </td>
                                            <td
                                                className={`px-4 py-3 font-medium ${order.orderStatus === "Delivered"
                                                    ? "text-green-600"
                                                    : order.orderStatus === "Cancelled"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                    }`}
                                            >
                                                {order.orderStatus}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-center space-x-2">
                                                {activeTab === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(order._id, "Delivered")}
                                                            className="text-green-600 hover:text-green-700 flex items-center gap-1 font-medium"
                                                        >
                                                            <CheckCircle size={16} /> Complete
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(order._id, "Cancelled")}
                                                            className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                                                        >
                                                            <XCircle size={16} /> Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {activeTab !== "pending" && (
                                                    <span className="text-gray-400 text-sm italic">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </StaffLayout>
    );
};

export default StaffOrdersPage;
