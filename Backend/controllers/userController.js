import Staff from "../models/staffModel.js";
import Customer from "../models/customerModel.js";

// 🧠 RESET PASSWORD FOR STAFF OR CUSTOMER
export const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Try to find the user in Staff or Customer
        let user = await Staff.findById(id);
        let userType = "staff";

        if (!user) {
            user = await Customer.findById(id);
            userType = "customer";
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Optional: role-based security check
        // - Only admins can reset staff passwords
        // - Customers can reset only their own
        if (req.user.role === "customer" && req.user._id.toString() !== id) {
            return res.status(403).json({ message: "Access denied: You can only reset your own password" });
        }
        if (req.user.role === "staff" && userType === "admin") {
            return res.status(403).json({ message: "Access denied: Staff cannot reset admin password" });
        }

        // 🔒 Hash new password

        user.password = password;
        await user.save();

        res.status(200).json({
            message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} password reset successfully`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
