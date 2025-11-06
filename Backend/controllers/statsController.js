import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Staff from "../models/staffModel.js";
import Customer from "../models/customerModel.js";

// 🧮 STAFF DASHBOARD STATS
export const getStaffStats = async (req, res) => {
    try {
        // ✅ Only staff/admin can access
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Access denied: Staff/Admin only" });
        }

        // ----------------------------
        // BASIC COUNTS
        // ----------------------------
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await Customer.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: { $nin: ["Delivered", "Cancelled"] },
        });

        // ----------------------------
        // STOCK DATA (for charts or alerts)
        // ----------------------------
        const products = await Product.find({}, "name stock").lean();
        const stockData = products.map((p) => ({
            name: p.name,
            stock: p.stock,
        }));

        // ----------------------------
        // SALES DATA (last 7 days)
        // ----------------------------
        const today = new Date();
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 6);

        const salesAgg = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: last7Days },
                    paymentStatus: "Paid",
                },
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    orders: { $sum: 1 },
                },
            },
        ]);

        // Convert Mongo day numbers (1=Sunday, 7=Saturday) → frontend-friendly order
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const salesData = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayNum = date.getDay() + 1; // MongoDB day (1-7)
            const found = salesAgg.find((d) => d._id === dayNum);
            salesData.push({
                day: dayNames[date.getDay()],
                orders: found ? found.orders : 0,
            });
        }

        // ----------------------------
        // RESPONSE PAYLOAD
        // ----------------------------
        res.status(200).json({
            stats: {
                totalOrders,
                totalCustomers,
                totalProducts,
                pendingOrders,
            },
            stockData,
            salesData,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📊 Dashboard Stats Controller (Admin only)
export const getDashboardStats = async (req, res) => {
    try {
        // ✅ Only admin can access stats
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        // ------------------------------
        // BASIC COUNTS
        // ------------------------------
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalStaff = await Staff.countDocuments({ role: { $in: ["admin", "staff"] } });

        // 💰 Calculate total sales from paid orders
        const totalSalesAgg = await Order.aggregate([
            { $match: { paymentStatus: "Paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        const totalSales = totalSalesAgg[0]?.total || 0;

        // ------------------------------
        // ORDERS BY STATUS
        // ------------------------------
        const orderStatusAgg = await Order.aggregate([
            { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
        ]);

        const ordersData = [
            { status: "Pending", count: 0 },
            { status: "Processing", count: 0 },
            { status: "Shipped", count: 0 },
            { status: "Delivered", count: 0 },
            { status: "Cancelled", count: 0 },
        ];

        orderStatusAgg.forEach((status) => {
            const found = ordersData.find((s) => s.status === status._id);
            if (found) found.count = status.count;
        });

        // ------------------------------
        // MONTHLY SALES (LAST 7 MONTHS)
        // ------------------------------
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);

        const salesAgg = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid",
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalSales: { $sum: "$totalAmount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Generate rolling 7-month window (current month backward)
        const salesData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthNumber = date.getMonth() + 1;
            const yearNumber = date.getFullYear();

            const sale = salesAgg.find(
                (s) => s._id.month === monthNumber && s._id.year === yearNumber
            );

            salesData.push({
                month: monthNames[monthNumber - 1],
                sales: sale ? sale.totalSales : 0,
            });
        }
        // ------------------------------
        // RESPONSE FORMAT
        // ------------------------------
        res.status(200).json({
            stats: {
                totalOrders,
                totalSales,
                totalProducts,
                totalStaff,
            },
            salesData,
            ordersData,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
