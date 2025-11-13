import Staff from "../models/staffModel.js";
import Customer from "../models/customerModel.js";

// 🧠 CHANGE PASSWORD FOR STAFF OR CUSTOMER (requires login)
export const changeUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Both current and new passwords are required" });
        }

        const userId = req.user._id;
        let user = await Staff.findById(userId);
        let userType = "staff";

        if (!user) {
            user = await Customer.findById(userId);
            userType = "customer";
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Use schema's matchPassword method
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Current password is incorrect" });
        }

        // 🧩 Update new password (hashing handled by pre-save hook)
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} password changed successfully`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const adminChangeUserPassword = async (req, res) => {
    try {
        const { id } = req.params; // target user ID
        const { adminPassword, newPassword } = req.body;

        if (!adminPassword || !newPassword) {
            return res.status(400).json({
                message: "Admin password and new password are required",
            });
        }

        // 🛑 Verify that the requester is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        // 🔍 Get admin details
        const admin = await Staff.findById(req.user._id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // 🧩 Check admin’s current password
        const isAdminMatch = await admin.matchPassword(adminPassword);
        if (!isAdminMatch) {
            return res.status(401).json({ message: "Admin password is incorrect" });
        }

        // 🔍 Find target user (could be staff or customer)
        let user = await Staff.findById(id);
        let userType = "staff";

        if (!user) {
            user = await Customer.findById(id);
            userType = "customer";
        }

        if (!user) {
            return res.status(404).json({ message: "Target user not found" });
        }

        // 🧠 Update password (schema handles hashing)
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} password updated successfully by admin`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};