import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
        },
        description: {
            type: String,
        },
        brand: {
            type: String,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            default: 0,
        },
        imageUrl: {
            type: String,
            default: "https://via.placeholder.com/150",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
