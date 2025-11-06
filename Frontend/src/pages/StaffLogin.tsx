// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const StaffLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log("Attempting login with:", email);
            const res = await api.post("/auth/staff/login", { email, password });
            console.log("Login response:", res.data);
            const user = {
                id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role
            };

            const { token } = res.data;
            console.log("Login successful:", user, token);
            login({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }, token);

            if (user.role === "admin") navigate("/admin/dashboard");
            else navigate("/staff/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-96"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    SmartGadgets Hub Login
                </h2>

                {error && <p className="text-red-500 text-center mb-2">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-3 border rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default StaffLogin;
