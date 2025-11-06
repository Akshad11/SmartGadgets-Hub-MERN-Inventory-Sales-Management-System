// src/pages/CustomerAuth.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // animation library
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const CustomerAuth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                const res = await api.post("/auth/customer/login", {
                    email: formData.email,
                    password: formData.password,
                });
                const user = {
                    id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role
                };
                login(user, res.data.token);
                navigate("/");
            } else {
                await api.post("/customers", formData);
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
                {/* Left Side — Animation Panel */}
                <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-1/2 p-10 transition-all duration-700">
                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.div
                                key="login-panel"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
                                <p className="text-blue-100">
                                    To keep shopping with us, please login using your credentials.
                                </p>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="mt-6 bg-white text-blue-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
                                >
                                    Sign Up
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup-panel"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <h2 className="text-3xl font-bold mb-3">Hello, Friend!</h2>
                                <p className="text-blue-100">
                                    Enter your details and start your shopping journey with us.
                                </p>
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="mt-6 bg-white text-blue-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
                                >
                                    Login
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side — Form */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login" : "signup"}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-sm"
                        >
                            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                                {isLogin ? "Customer Login" : "Create Account"}
                            </h2>

                            {error && (
                                <p className="text-red-500 text-center text-sm mb-3">{error}</p>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md shadow transition"
                                >
                                    {loading
                                        ? "Please wait..."
                                        : isLogin
                                            ? "Login"
                                            : "Sign Up"}
                                </button>
                            </form>

                            <p className="text-center text-gray-600 text-sm mt-4">
                                {isLogin ? (
                                    <>
                                        Don’t have an account?{" "}
                                        <span
                                            onClick={() => setIsLogin(false)}
                                            className="text-blue-600 font-medium hover:underline cursor-pointer"
                                        >
                                            Sign up
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <span
                                            onClick={() => setIsLogin(true)}
                                            className="text-blue-600 font-medium hover:underline cursor-pointer"
                                        >
                                            Login
                                        </span>
                                    </>
                                )}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CustomerAuth;
