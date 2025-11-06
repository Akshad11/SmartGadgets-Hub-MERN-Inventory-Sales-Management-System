// src/pages/staff/StaffDashboard.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
    ClipboardList,
    Users,
    Package,
    Clock,
} from "lucide-react";
import StaffLayout from "../../layout/StaffLayout";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import api from "../../api/axiosInstance";
import { exportToCSV, exportToExcel } from "../../utils/exportUtils";

const StaffDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        pendingOrders: 0,
    });

    const [stockData, setStockData] = useState<{ name: string; stock: number }[]>([]);
    const [salesData, setSalesData] = useState([
        { day: "Mon", orders: 10 },
        { day: "Tue", orders: 12 },
        { day: "Wed", orders: 7 },
        { day: "Thu", orders: 15 },
        { day: "Fri", orders: 10 },
        { day: "Sat", orders: 18 },
        { day: "Sun", orders: 12 },
    ]);

    // Fetching data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/stats/staff-dashboard");
                console.log("Fetched staff dashboard data:", res.data);
                setSalesData(res.data.salesData);
                setStats(res.data.stats);
                setStockData(res.data.stockData);
            } catch (error) {
                toast.error("Failed to fetch dashboard data.");
            }
        };

        fetchData();
    }, []);

    return (
        <StaffLayout>
            <Toaster position="top-right" />
            <div className="p-6 space-y-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col md:flex-row justify-between md:items-center gap-4"
                >
                    <h1 className="text-3xl font-bold text-gray-800">👨‍💼 Staff Dashboard</h1>
                    <p className="text-gray-500">
                        Welcome back, <span className="font-semibold text-blue-600">Team</span>!
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
                        icon={<ClipboardList className="text-blue-600 w-8 h-8" />}
                        title="Total Orders"
                        value={stats.totalOrders}
                        color="blue"
                    />
                    <DashboardCard
                        icon={<Users className="text-purple-600 w-8 h-8" />}
                        title="Customers"
                        value={stats.totalCustomers}
                        color="purple"
                    />
                    <DashboardCard
                        icon={<Package className="text-yellow-500 w-8 h-8" />}
                        title="Products"
                        value={stats.totalProducts}
                        color="yellow"
                    />
                    <DashboardCard
                        icon={<Clock className="text-orange-500 w-8 h-8" />}
                        title="Pending Orders"
                        value={stats.pendingOrders}
                        color="orange"
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
                </motion.div>
                {/* Orders Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white shadow-md rounded-2xl p-6"
                >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Weekly Orders Activity
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#2563eb"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                            <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                            <XAxis dataKey="day" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center text-gray-500 text-sm mt-8"
                >
                    SmartGadgets Hub Staff Dashboard © {new Date().getFullYear()}
                </motion.div>
            </div>
        </StaffLayout>
    );
};

export default StaffDashboard;

//
// ======= Reusable Card Component =======
//
interface CardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: "blue" | "purple" | "yellow" | "orange";
}

const DashboardCard: React.FC<CardProps> = ({ icon, title, value, color }) => {
    const colorMap: Record<string, string> = {
        blue: "text-blue-600 bg-blue-100",
        purple: "text-purple-600 bg-purple-100",
        yellow: "text-yellow-600 bg-yellow-100",
        orange: "text-orange-600 bg-orange-100",
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
            </div>
            <div className={`p-3 rounded-xl ${colorMap[color]} bg-opacity-20`}>
                {icon}
            </div>
        </motion.div>
    );
};
