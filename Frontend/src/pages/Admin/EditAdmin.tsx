import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axiosInstance";
import Breadcrumb from "../../components/Breadcrumb";

interface IAdmin {
    _id: string;
    name: string;
    email: string;
    role: "admin";
}

const EditAdmin: React.FC = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [adminData, setAdminData] = useState<IAdmin | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load admin details
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await api.get(`/staff/${user?.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAdminData(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load admin details");
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchAdmin();
    }, [user, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdminData((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminData) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await api.put(
                `/staff/${user?.id}`,
                {
                    name: adminData.name,
                    email: adminData.email,
                    role: "admin", // FORCE admin (cannot change)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess("✅ Profile updated successfully!");

            setTimeout(() => navigate("/admin-profile"), 1200);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update admin profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Loading admin details...
            </div>
        );
    }

    if (!adminData) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Failed to load admin profile.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto mb-6">
                <Breadcrumb
                    items={[
                        { label: "Dashboard", path: "/admin/dashboard" },
                        { label: "Admin Profile", path: "/admin-profile" },
                        { label: "Edit Profile" },
                    ]}
                />
            </div>

            <div className="flex justify-center items-center px-4">
                <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg hover:shadow-lg transition">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                        Edit Admin Profile
                    </h2>

                    {error && <p className="text-red-500 text-center mb-3">{error}</p>}
                    {success && (
                        <p className="text-green-600 text-center mb-3 animate-pulse">
                            {success}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={adminData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={adminData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Role (Disabled) */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Role</label>
                            <input
                                type="text"
                                value="admin"
                                disabled
                                className="w-full p-2 border rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1 italic">
                                Role cannot be changed for admin users.
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4 transition hover:shadow-md"
                        >
                            {saving ? "Saving..." : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAdmin;
