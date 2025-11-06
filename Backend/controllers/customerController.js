import Customer from "../models/customerModel.js";

// 🧠 CREATE (Register)
export const registerCustomer = async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    try {
        const exists = await Customer.findOne({ email });
        if (exists) return res.status(400).json({ message: "Customer already exists" });

        const customer = await Customer.create({ name, email, password, phone, address });
        const token = customer.generateToken();

        res.status(201).json({
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧠 READ (All customers)
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().select("-password");
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧠 READ (Single customer)
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).select("-password");
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧠 UPDATE
export const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        customer.name = req.body.name || customer.name;
        customer.email = req.body.email || customer.email;
        customer.phone = req.body.phone || customer.phone;
        customer.address = req.body.address || customer.address;

        if (req.body.password) {
            customer.password = req.body.password;
        }

        const updatedCustomer = await customer.save();
        res.status(200).json(updatedCustomer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🧠 DELETE
export const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        await customer.deleteOne();
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
