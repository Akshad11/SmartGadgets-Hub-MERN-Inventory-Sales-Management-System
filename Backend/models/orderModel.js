import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: [true, "Customer reference is required"],
        },

        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                imageUrl: { type: String },
            },
        ],

        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Credit Card", "Debit Card", "UPI", "Net Banking"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },

        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, default: "India" },
        },

        totalAmount: {
            type: Number,
            required: [true, "Total amount is required"],
        },

        orderStatus: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
