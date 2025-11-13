import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axiosInstance";
import StaffLayout from "../../layout/StaffLayout";
import AdminLayout from "../../layout/AdminLayout";
import { Calendar, Mail, Shield, Edit, Key } from "lucide-react";

interface IStaff {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
}

const StaffProfile: React.FC = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [staff, setStaff] = useState<IStaff | null>(null);
    const [loading, setLoading] = useState(true);

    // Select layout based on role
    const Layout = user?.role === "admin" ? AdminLayout : StaffLayout;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/staff/${user?.id}`);
                setStaff(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchProfile();
    }, [user, token]);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen text-gray-500">
                    Loading profile...
                </div>
            </Layout>
        );
    }

    if (!staff) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen text-red-500">
                    Failed to load staff profile.
                </div>
            </Layout>
        );
    }

    const handleEditUser = () => {
        if (user?.role === "admin") {
            navigate(`/admin-editprofile`);

        } else {
            navigate(`/edit-user/staff/${user?.id}`);
        }
    };

    const handlePasswordUser = () => {
        navigate(`/change-password`);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8"
                >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <img
                            src={`https://api.dicebear.com/8.x/initials/svg?seed=${staff.name}`}
                            alt="Profile Avatar"
                            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md mb-3"
                        />
                        <h1 className="text-3xl font-semibold text-gray-800">
                            {staff.name}
                        </h1>
                        <p className="text-blue-600 font-medium capitalize">{staff.role}</p>
                    </div>

                    {/* Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-50 rounded-xl shadow-inner p-6 space-y-4"
                    >
                        <div className="flex items-center gap-3 text-gray-700">
                            <Mail size={18} />
                            <span>{staff.email}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <Shield size={18} />
                            <span>Role: {staff.role}</span>
                        </div>

                        {staff.createdAt && (
                            <div className="flex items-center gap-3 text-gray-700">
                                <Calendar size={18} />
                                <span>
                                    Joined on:{" "}
                                    {new Date(staff.createdAt).toLocaleDateString("en-IN")}
                                </span>
                            </div>
                        )}
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditUser}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
                        >
                            <Edit size={18} /> Edit Profile
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePasswordUser}
                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl shadow-md transition"
                        >
                            <Key size={18} /> Change Password
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default StaffProfile;
