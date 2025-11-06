import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axiosInstance";
import Breadcrumb from "../../components/Breadcrumb";
import { UserPlus, Loader2 } from "lucide-react";

const AddStaff: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "staff",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("⚠️ Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            await api.post(
                "/staff",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess("✅ Staff added successfully!");
            setTimeout(() => navigate("/admin/staff-customers"), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add staff");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4">
            <div className="max-w-5xl mx-auto mb-6">
                <Breadcrumb
                    items={[
                        { label: "Dashboard", path: "/admin/dashboard" },
                        { label: "Staff & Customers", path: "/admin/staff-customers" },
                        { label: "Add Staff" },
                    ]}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-100"
            >
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-semibold text-center text-gray-800 mb-6 flex items-center justify-center gap-2"
                >
                    <UserPlus className="text-blue-600" /> Add New Staff
                </motion.h2>

                {error && <p className="text-red-500 text-center mb-3">{error}</p>}
                {success && <p className="text-green-600 text-center mb-3">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                            placeholder="staff@example.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                required
                                minLength={6}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {/* Role Dropdown */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                        >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Choose “Admin” to promote this user to admin privileges.
                        </p>
                    </div>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <UserPlus />}
                        {loading ? "Adding Staff..." : "Add Staff"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddStaff;
