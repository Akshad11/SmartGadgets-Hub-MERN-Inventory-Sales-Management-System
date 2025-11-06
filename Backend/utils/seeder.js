import dotenv from "dotenv";
import Staff from "../models/staffModel.js";
import Customer from "../models/customerModel.js";
import staffData from "../data/staff.json" assert { type: "json" };
import customerData from "../data/customer.json" assert { type: "json" };
import connectDB from "../config/db.js";

dotenv.config();

await connectDB();

const importData = async () => {
    try {
        await Staff.deleteMany();
        await Customer.deleteMany();

        await Staff.insertMany(staffData);
        await Customer.insertMany(customerData);

        console.log("✅ Sample data imported successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error importing data:", error);
        process.exit(1);
    }
};

importData();
