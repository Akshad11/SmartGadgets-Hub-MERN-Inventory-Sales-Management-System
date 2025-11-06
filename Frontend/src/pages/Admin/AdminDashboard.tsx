// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ShoppingBag,
    Package,
    Users,
    IndianRupee,
    TrendingUp,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import api from "../../api/axiosInstance";
import { exportToCSV, exportToExcel } from "../../utils/exportUtils";

const AdminDashboard: React.FC = () => {
    // Mock data (replace with API later)
    const [stats, setStats] = useState({
        totalOrders: 156,
        totalSales: 842350,
        totalProducts: 128,
        totalStaff: 6,
    });

    const [salesData, setSalesData] = useState([
        { month: "Jan", sales: 50000 },
        { month: "Feb", sales: 70000 },
        { month: "Mar", sales: 65000 },
        { month: "Apr", sales: 90000 },
        { month: "May", sales: 85000 },
        { month: "Jun", sales: 95000 },
        { month: "Jul", sales: 120000 },
    ]);

    const [ordersData, setOrdersData] = useState([
        { status: "Pending", count: 12 },
        { status: "Shipped", count: 24 },
        { status: "Delivered", count: 102 },
        { status: "Cancelled", count: 8 },
    ]);

    useEffect(() => {
        try {
            const fetchDashboardData = async () => {
                const res = await api.get("/stats/admin-dashboard");
                console.log("Fetched dashboard data:", res.data);
                setStats(res.data.stats);
                setSalesData(res.data.salesData);
                setOrdersData(res.data.ordersData);
            };
            fetchDashboardData();
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    }, []);

    return (
        <AdminLayout>
            <div className="p-6 space-y-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col md:flex-row justify-between md:items-center gap-4"
                >
                    <h1 className="text-3xl font-bold text-gray-800">
                        👑 Admin Dashboard
                    </h1>
                    <p className="text-gray-500">
                        Welcome back, <span className="font-semibold text-blue-600">Admin</span>!
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
                >
                    <DashboardCard
                        icon={<ShoppingBag className="text-blue-600 w-8 h-8" />}
                        title="Total Orders"
                        value={stats.totalOrders}
                        trend="+12%"
                        color="blue"
                    />
                    <DashboardCard
                        icon={<IndianRupee className="text-green-600 w-8 h-8" />}
                        title="Total Sales"
                        value={`₹${stats.totalSales.toLocaleString()}`}
                        trend="+18%"
                        color="green"
                    />
                    <DashboardCard
                        icon={<Package className="text-yellow-500 w-8 h-8" />}
                        title="Total Products"
                        value={stats.totalProducts}
                        trend="+5%"
                        color="yellow"
                    />
                    <DashboardCard
                        icon={<Users className="text-purple-600 w-8 h-8" />}
                        title="Staff Members"
                        value={stats.totalStaff}
                        trend="+1%"
                        color="purple"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-wrap gap-3 mb-6"
                >
                    <button
                        onClick={() => exportToExcel(salesData, "Sales_Report")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
                    >
                        📊 Export Sales (Excel)
                    </button>

                    <button
                        onClick={() => exportToCSV(salesData, "Sales_Report")}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md border border-blue-300 transition"
                    >
                        📁 Export Sales (CSV)
                    </button>

                    <button
                        onClick={() => exportToExcel(ordersData, "Orders_Report")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
                    >
                        📦 Export Orders (Excel)
                    </button>

                    <button
                        onClick={() => exportToCSV(ordersData, "Orders_Report")}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md border border-green-300 transition"
                    >
                        🧾 Export Orders (CSV)
                    </button>
                </motion.div>
                {/* Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {/* Sales Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white shadow-md rounded-2xl p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Monthly Sales Trend
                            </h2>
                            <TrendingUp className="text-blue-600" />
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                                <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Orders Breakdown Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white shadow-md rounded-2xl p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Orders Breakdown
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ordersData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="status" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Footer Summary */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center text-gray-500 text-sm mt-8"
                >
                    SmartGadgets Hub Admin Dashboard © {new Date().getFullYear()}
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

//
// ======= Dashboard Card Component =======
//
interface CardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    trend: string;
    color: "blue" | "green" | "yellow" | "purple";
}

const DashboardCard: React.FC<CardProps> = ({ icon, title, value, trend, color }) => {
    const colorMap: Record<string, string> = {
        blue: "text-blue-600 bg-blue-100",
        green: "text-green-600 bg-green-100",
        yellow: "text-yellow-600 bg-yellow-100",
        purple: "text-purple-600 bg-purple-100",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-all"
        >
            <div className="flex flex-col">
                <p className="text-gray-500 text-sm">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                <span className={`text-xs font-semibold ${colorMap[color]} px-2 py-1 rounded-full w-fit mt-2`}>
                    {trend} from last month
                </span>
            </div>
            <div className={`p-3 rounded-xl ${colorMap[color]} bg-opacity-20`}>{icon}</div>
        </motion.div>
    );
};
