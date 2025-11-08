import React, { useEffect, useState } from "react";
import { Download, FileSpreadsheet, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../../layout/AdminLayout";
import Breadcrumb from "../../components/Breadcrumb";
import api from "../../api/axiosInstance";
import { utils, writeFile } from "xlsx";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import ExportLogsButton from "../../components/btnExportLogs";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#facc15"];

const AdminReports: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalCustomers: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersRes = await api.get("/orders");
                const customersRes = await api.get("/customers");

                const allOrders = ordersRes.data || [];
                const totalSales = allOrders.reduce(
                    (sum: number, o: any) => sum + (o.totalAmount || 0),
                    0
                );

                const recentSales = allOrders
                    .slice(-7)
                    .map((o: any, i: number) => ({
                        name: `Day ${i + 1}`,
                        revenue: o.totalAmount,
                    }));

                setOrders(allOrders);
                setSalesData(recentSales);
                setStats({
                    totalSales,
                    totalOrders: allOrders.length,
                    totalCustomers: customersRes.data?.length || 0,
                });
            } catch (err) {
                console.error("Failed to load reports", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleExport = (type: "csv" | "xlsx") => {
        const ws = utils.json_to_sheet(orders);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Orders");

        const filename =
            type === "csv"
                ? "SmartGadgets_Orders_Report.csv"
                : "SmartGadgets_Orders_Report.xlsx";
        writeFile(wb, filename);
    };

    const statusData = [
        { name: "Pending", value: orders.filter((o) => o.orderStatus === "Pending").length },
        { name: "Processing", value: orders.filter((o) => o.orderStatus === "Processing").length },
        { name: "Delivered", value: orders.filter((o) => o.orderStatus === "Delivered").length },
        { name: "Cancelled", value: orders.filter((o) => o.orderStatus === "Cancelled").length },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-[80vh] text-gray-500">
                    Loading Reports...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", path: "/admin/dashboard" },
                    { label: "Reports" },
                ]}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
                    <BarChart3 className="text-blue-600" /> Reports & Analytics
                </h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-blue-600 text-white p-6 rounded-xl shadow-lg"
                    >
                        <h3 className="text-lg">Total Sales</h3>
                        <p className="text-2xl font-semibold mt-2">
                            ₹{stats.totalSales.toLocaleString()}
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-green-600 text-white p-6 rounded-xl shadow-lg"
                    >
                        <h3 className="text-lg">Total Orders</h3>
                        <p className="text-2xl font-semibold mt-2">
                            {stats.totalOrders.toLocaleString()}
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-yellow-500 text-white p-6 rounded-xl shadow-lg"
                    >
                        <h3 className="text-lg">Total Customers</h3>
                        <p className="text-2xl font-semibold mt-2">
                            {stats.totalCustomers.toLocaleString()}
                        </p>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-6 rounded-xl shadow-md"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Revenue Trend (Last 7 Days)
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Order Status Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-6 rounded-xl shadow-md"
                    >
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">
                            Order Status Breakdown
                        </h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {statusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-4 justify-end mt-6">
                    <button
                        onClick={() => handleExport("csv")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
                    >
                        <Download size={18} /> Export CSV
                    </button>
                    <button
                        onClick={() => handleExport("xlsx")}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
                    >
                        <FileSpreadsheet size={18} /> Export Excel
                    </button>
                    <ExportLogsButton />
                </div>
            </motion.div>
        </AdminLayout>
    );
};

export default AdminReports;
