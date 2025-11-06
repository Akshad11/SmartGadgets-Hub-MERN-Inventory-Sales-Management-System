// src/pages/Shared/EditUser.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axiosInstance";
import Breadcrumb from "../../components/Breadcrumb";

interface IUser {
    _id: string;
    name: string;
    email: string;
    role?: "admin" | "staff"; // Only for staff users
    type: "staff" | "customer"; // Identify which type
}

const EditUser: React.FC = () => {
    const { token } = useAuth();
    const { id, type } = useParams<{ id: string; type: "staff" | "customers" }>();
    const navigate = useNavigate();

    const [userData, setUserData] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch staff or customer by ID
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/${type}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData({ ...res.data, type });
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch user");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, type, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData) return;
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await api.put(
                `/admin/${type}/${id}`,
                {
                    name: userData.name,
                    email: userData.email,
                    ...(userData.type === "staff" ? { role: userData.role } : {}),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess("✅ User updated successfully!");
            setTimeout(() => navigate("/admin/staff-customers"), 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update user");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Loading user details...
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                User not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto mb-6">
                <Breadcrumb
                    items={[
                        { label: "Dashboard", path: "/admin/dashboard" },
                        { label: "Staff & Customers", path: "/admin/staff-customers" },
                        { label: `Edit ${userData.type === "staff" ? "Staff" : "Customer"}` }
                    ]}
                />
            </div>
            <div className=" flex justify-center items-center px-4">
                <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                        Edit {userData.type === "staff" ? "Staff" : "Customer"} Details
                    </h2>

                    {error && <p className="text-red-500 text-center mb-3">{error}</p>}
                    {success && <p className="text-green-600 text-center mb-3">{success}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        {userData.type === "staff" && (
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Role</label>
                                <select
                                    name="role"
                                    value={userData.role}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    You can promote/demote this staff member.
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4"
                        >
                            {saving ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
