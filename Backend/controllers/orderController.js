import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// 🧠 CREATE Order (Customer checkout)
export const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items found" });
        }

        // Verify stock availability
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
        }

        // Create new order
        const order = new Order({
            customer: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalAmount,
            paymentStatus: "Pending",
            orderStatus: "Pending",
        });

        const createdOrder = await order.save();

        // Reduce product stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            await product.save();
        }

        res.status(201).json({
            message: "Order placed successfully",
            order: createdOrder,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧠 GET Orders for Logged-in Customer
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate("orderItems.product", "name price imageUrl")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧠 GET All Orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Access denied: Admins and Staff only" });
        }

        const orders = await Order.find()
            .populate("customer", "name email")
            .populate("processedBy", "name email role")
            .populate("orderItems.product", "name price category")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧠 UPDATE Order Status (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "staff") {
            return res.status(403).json({ message: "Access denied: Admins and Staff only" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const { orderStatus, paymentStatus } = req.body;

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        order.processedBy = req.user._id;
        const updatedOrder = await order.save();

        res.status(200).json({
            message: "Order updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧠 DELETE Order (Admin only)
export const deleteOrder = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        await order.deleteOne();
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
