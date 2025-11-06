import Staff from "../models/staffModel.js";

// 🧠 Staff/Admin Login
export const loginStaff = async (req, res) => {
    const { email, password } = req.body;

    try {
        const staff = await Staff.findOne({ email });
        if (!staff) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isMatch = await staff.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = staff.generateToken();

        res.status(200).json({
            _id: staff._id,
            name: staff.name,
            email: staff.email,
            role: staff.role,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧾 Get Staff Profile
export const getStaffProfile = async (req, res) => {
    try {
        const staff = await Staff.findById(req.user._id).select("-password");
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
