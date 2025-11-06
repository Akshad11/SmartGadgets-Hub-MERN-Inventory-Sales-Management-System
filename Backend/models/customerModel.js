import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// 🔒 Hash password before saving
customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 🔐 Match password for login
customerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🎟️ Generate JWT token
customerSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id, role: "customer" },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
