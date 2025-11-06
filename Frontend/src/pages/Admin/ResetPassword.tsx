// src/pages/Admin/ResetPassword.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axiosInstance";
import Breadcrumb from "../../components/Breadcrumb";
import { LockKeyhole, Loader2 } from "lucide-react";

const ResetPassword: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("⚠️ Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            if (user?.role === "staff") {
                await api.put(
                    `/users/reset-password/${id}`,
                    { password }
                );
            } else {
                await api.put(
                    `/users/reset-password/${id}`,
                    { password }
                );
            }
            setSuccess("✅ Password reset successfully!");
            setTimeout(() => navigate("/admin/staff-customers"), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password");
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
                        { label: "Reset Password" },
                    ]}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-8 border border-gray-100"
            >
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
                    <LockKeyhole className="text-blue-600" /> Reset Password
                </h2>

                {error && <p className="text-red-500 text-center mb-3">{error}</p>}
                {success && <p className="text-green-600 text-center mb-3">{success}</p>}

                <form onSubmit={handleReset} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                            placeholder="Enter new password"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
                            placeholder="Re-enter new password"
                            required
                            minLength={6}
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <LockKeyhole />
                        )}
                        {loading ? "Resetting..." : "Reset Password"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
