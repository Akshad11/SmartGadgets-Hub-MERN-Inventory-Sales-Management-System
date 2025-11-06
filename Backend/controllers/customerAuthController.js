import Customer from "../models/customerModel.js";

// 🧠 Customer Login
export const loginCustomer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isMatch = await customer.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = customer.generateToken();

        res.status(200).json({
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            role: "customer",
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🧾 Get Customer Profile
export const getCustomerProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id).select("-password");
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
