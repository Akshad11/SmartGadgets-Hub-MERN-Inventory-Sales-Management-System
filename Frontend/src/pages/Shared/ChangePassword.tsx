import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axiosInstance";
import Breadcrumb from "../../components/Breadcrumb";

const ChangePassword: React.FC = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required!");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            await api.put(
                `/auth/staff/change-password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess("✅ Password changed successfully!");
            setTimeout(() => {
                navigate(
                    user?.role === "admin" ? "/admin/dashboard" : "/staff/dashboard"
                );
            }, 1200);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-3xl mx-auto mb-6">
                <Breadcrumb
                    items={[
                        {
                            label: "Dashboard",
                            path:
                                user?.role === "admin"
                                    ? "/admin/dashboard"
                                    : "/staff/dashboard",
                        },
                        { label: "Change Password" },
                    ]}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all duration-300"
            >
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    Change Password
                </h2>

                {error && (
                    <p className="text-red-500 text-center mb-3 animate-pulse">{error}</p>
                )}
                {success && (
                    <p className="text-green-600 text-center mb-3 animate-pulse">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your current password"
                            required
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter new password"
                            required
                            minLength={6}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Re-enter new password"
                            required
                            minLength={6}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium mt-4 shadow-md transition-all"
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ChangePassword;
