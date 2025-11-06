import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import staffRoutes from "./routes/staffRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import staffAuthRoutes from "./routes/staffAuthRoutes.js";
import customerAuthRoutes from "./routes/customerAuthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Ensure default admin exists
import Staff from "./models/staffModel.js";
import bcrypt from "bcryptjs";

const ensureAdminExists = async () => {
    const existingAdmin = await Staff.findOne({ role: "admin" });
    if (!existingAdmin) {
        const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 10); // Hash default password
        await Staff.create({
            name: "System Administrator", // Default name
            email: process.env.ADMIN_EMAIL || "admin@smartgadgets.com", // Default email
            password: hashed, // Hashed password 
            role: "admin",
        });
        console.log("✅ Default admin created automatically on startup.");
    }
};


dotenv.config();

await connectDB();

const app = express();

ensureAdminExists();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173", // Adjust as needed
        credentials: true,
    })
);

app.use("/api/staff", staffRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/auth/staff", staffAuthRoutes);
app.use("/api/auth/customer", customerAuthRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});