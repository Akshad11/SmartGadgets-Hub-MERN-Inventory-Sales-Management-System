import Staff from "../models/staffModel.js";

// 🧠 CREATE (Register new staff/admin)
export const registerStaff = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const exists = await Staff.findOne({ email });
        if (exists) return res.status(400).json({ message: "Staff already exists" });

        const staff = await Staff.create({ name, email, password, role });
        const token = staff.generateToken();

        res.status(201).json({
            _id: staff._id,
            name: staff.name,
            email: staff.email,
            role: staff.role,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧠 READ (Get all staff)
export const getAllStaff = async (req, res) => {
    try {
        const staffList = await Staff.find().select("-password");
        res.status(200).json(staffList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧠 READ (Get single staff)
export const getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id).select("-password");
        if (!staff) return res.status(404).json({ message: "Staff not found" });
        res.status(200).json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧠 UPDATE
export const updateStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        staff.name = req.body.name || staff.name;
        staff.email = req.body.email || staff.email;
        staff.role = req.body.role || staff.role;

        if (req.body.password) {
            staff.password = req.body.password;
        }

        const updatedStaff = await staff.save();
        res.status(200).json(updatedStaff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧠 DELETE
export const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        await staff.deleteOne();
        res.status(200).json({ message: "Staff deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
