import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Staff from "../models/staffModel.js";

dotenv.config();

const seedAdminUser = async () => {
    try {
        await connectDB();

        // 🔍 Check if an admin already exists
        const existingAdmin = await Staff.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("✅ Admin user already exists:", existingAdmin.email);
            process.exit();
        }

        // 🧠 Default admin credentials
        const adminData = {
            name: "System Administrator",
            email: process.env.ADMIN_EMAIL || "admin@smartgadgets.com",
            password: process.env.ADMIN_PASSWORD || "Admin@123",
            role: "admin",
        };

        // 🔒 Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(adminData.password, salt);

        // 💾 Create admin
        const admin = await Staff.create(adminData);

        console.log("✅ Default admin user created successfully!");
        console.log("📧 Email:", admin.email);
        console.log("🔑 Password:", process.env.ADMIN_PASSWORD || "Admin@123");

        process.exit();
    } catch (error) {
        console.error("❌ Error creating admin user:", error.message);
        process.exit(1);
    }
};

seedAdminUser();
