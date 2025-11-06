// src/pages/Profile.tsx
import React, { use, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Package, ArrowLeft, ChevronDown, Truck, CreditCard } from "lucide-react";
import CustomerLayout from "../layout/CustomerLayout";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import type { ICustomer, IOrder } from "../types";

const Profile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"details" | "orders">("details");
    const [loggedUser, setLoggedUser] = useState<ICustomer | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await api.get("/auth/customer/profile/");
                const customerData: ICustomer = res.data;
                setLoggedUser(customerData);
            } catch (err) {
                console.error("Failed to fetch user details", err);
            }
        };
        fetchUserDetails();
    }, []);

    return (
        <CustomerLayout>
            <div className="max-w-6xl mx-auto mt-10 mb-10 bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Sidebar */}
                <aside className="bg-blue-600 text-white w-full md:w-64 flex flex-row md:flex-col items-center md:items-start justify-around md:justify-start p-4 space-y-0 md:space-y-4">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`flex items-center gap-2 w-full md:w-auto px-4 py-2 rounded-lg transition ${activeTab === "details" ? "bg-blue-800" : "hover:bg-blue-700"
                            }`}
                    >
                        <User size={20} /> <span>Edit Details</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`flex items-center gap-2 w-full md:w-auto px-4 py-2 rounded-lg transition ${activeTab === "orders" ? "bg-blue-800" : "hover:bg-blue-700"
                            }`}
                    >
                        <Package size={20} /> <span>My Orders</span>
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 w-full md:w-auto px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <ArrowLeft size={20} /> <span>Back</span>
                    </button>
                </aside>

                {/* Content Section */}
                <main className="flex-1 p-6 md:p-8 bg-gray-50">
                    {activeTab === "details" && <EditUserDetails user={loggedUser} />}
                    {activeTab === "orders" && <UserOrders user={loggedUser} />}
                </main>
            </div>
        </CustomerLayout>
    );
};

export default Profile;

const EditUserDetails = ({ user }: { user: ICustomer | null }) => {

    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            });
        }
    }, [user]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await api.put("/customers/" + user?._id, formData);
            alert("User details updated successfully!");
        } catch (err) {
            console.error("Failed to update user details", err);
            alert("Failed to update user details. Please try again.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md rounded-2xl p-6"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit User Details</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Full Name</label>
                    <input
                        name="name"
                        value={formData?.name || ""}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData?.email || ""}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Phone</label>
                    <input
                        name="phone"
                        value={formData?.phone || ""}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Address</label>
                    <textarea
                        name="address"
                        value={formData?.address || ""}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md"
                >
                    Save Changes
                </motion.button>
            </div>
        </motion.div>
    );
};

const UserOrders = ({ user }: { user: ICustomer | null }) => {
    const [orders, setOrders] = useState<Array<IOrder>>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders/my-orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };

        fetchOrders();
    }, [user?._id]);

    return (
        <MyOrdersAccordion orders={orders} />
    );
};

const MyOrdersAccordion: React.FC<{ orders: IOrder[] }> = ({ orders }) => {
    const [expanded, setExpanded] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpanded((prev) => (prev === id ? null : id));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-md rounded-2xl p-6"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h2>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div
                        key={order._id}
                        className="border rounded-xl mb-4 overflow-hidden shadow-sm"
                    >
                        {/* Header */}
                        <button
                            onClick={() => order._id && toggleExpand(order._id)}
                            className="w-full flex justify-between items-center bg-gray-50 px-4 py-3 hover:bg-gray-100 transition"
                        >
                            <div className="text-left">
                                <p className="font-semibold text-gray-800">
                                    Order #{order._id ? order._id.slice(-6).toUpperCase() : "N/A"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt ?? "").toLocaleString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold text-blue-600">
                                    ₹{order.totalAmount.toLocaleString()}
                                </p>
                                <p
                                    className={`text-sm font-medium ${order.orderStatus === "Delivered"
                                        ? "text-green-600"
                                        : order.orderStatus === "Shipped"
                                            ? "text-blue-600"
                                            : "text-yellow-600"
                                        }`}
                                >
                                    {order.orderStatus}
                                </p>
                            </div>

                            <motion.div
                                animate={{ rotate: expanded === order._id ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="text-gray-600 ml-3" />
                            </motion.div>
                        </button>

                        {/* Expandable Content */}
                        <AnimatePresence>
                            {expanded === order._id && (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-5 py-4 bg-white border-t"
                                >
                                    {/* 🛒 Order Items */}
                                    <div className="space-y-3 mb-4">
                                        <h4 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
                                            <Package size={18} /> Items
                                        </h4>
                                        {order.orderItems.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.imageUrl || "https://via.placeholder.com/50"}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-md object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-gray-700">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 🚚 Shipping */}
                                    <div className="mb-4">
                                        <h4 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
                                            <Truck size={18} /> Shipping
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-5">
                                            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                                            {order.shippingAddress.state}, {order.shippingAddress.postalCode},{" "}
                                            {order.shippingAddress.country}
                                        </p>
                                    </div>

                                    {/* 💳 Payment */}
                                    <div>
                                        <h4 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
                                            <CreditCard size={18} /> Payment
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Method:{" "}
                                            <span className="font-medium text-gray-800">
                                                {order.paymentMethod}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Status:{" "}
                                            <span
                                                className={`font-semibold ${order.paymentStatus === "Paid"
                                                    ? "text-green-600"
                                                    : order.paymentStatus === "Pending"
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                                    }`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))
            )}
        </motion.div>
    );
};