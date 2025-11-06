import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layout/AdminLayout";
import type { IStaff } from "../../types";
import api from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { UserCog, ShieldPlus, RefreshCcw } from "lucide-react";

const AdminStaffCustomers = () => {
    const [activeTab, setActiveTab] = useState<"staff" | "customers">("staff");
    const { user } = useAuth();
    const [staff, setStaff] = useState<IStaff[]>([]);
    const [customers, setCustomers] = useState<IStaff[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const staffRes = await api.get("/staff");
            const customerRes = await api.get("/customers");
            setStaff(staffRes.data);
            setCustomers(customerRes.data);
        };
        fetchData();
    }, []);

    const handleEditUser = (id: string, type: "staff" | "customers") => {
        navigate(`/edit-user/${type}/${id}`);
    };

    const handleEditCustomer = (id: string) => {
        navigate(`/edit-customer/${id}`);
    };

    const handleresetPassword = (id: string) => {
        navigate(`/resetPassword/${id}`);
    };



    return (
        <AdminLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", path: "/admin/dashboard" },
                    { label: "Staff & Customers" },
                ]}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Staff & Customers</h1>
                <button
                    onClick={() => navigate("/add-staff")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition"
                >
                    <ShieldPlus size={18} /> Add Staff
                </button>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-300">
                {["staff", "customers"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as "staff" | "customers")}
                        className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${activeTab === tab
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab === "staff" ? "Staff" : "Customers"}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100/60">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                User
                            </th>
                            <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                Email
                            </th>
                            <th className="px-5 py-3 text-center font-semibold text-gray-700 uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <AnimatePresence>
                        <tbody className="divide-y divide-gray-100">
                            {(activeTab === "staff"
                                ? staff.filter((s) => s.email !== user?.email)
                                : customers
                            ).map((usr, index) => (
                                <motion.tr
                                    key={usr._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        delay: index * 0.04,
                                        duration: 0.3,
                                        type: "spring",
                                        stiffness: 120,
                                    }}
                                    className="group cursor-pointer transition-all duration-300 hover:bg-blue-50/40 hover:shadow-sm hover:scale-[1.005]"
                                >
                                    {/* Avatar + Name */}
                                    <td className="px-5 py-3 flex items-center gap-4 text-gray-800 font-medium rounded-l-xl">
                                        <motion.img
                                            src={`https://api.dicebear.com/8.x/initials/svg?seed=${usr.name}`}
                                            alt={usr.name}
                                            className="w-10 h-10 rounded-full border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{usr.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">
                                                {activeTab === "staff" ? usr.role : "customer"}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-5 py-3 text-gray-600">{usr.email}</td>

                                    {/* Actions */}
                                    <td className="px-5 py-3 text-center flex justify-center gap-2 rounded-r-xl">
                                        <button
                                            onClick={() =>
                                                activeTab === "staff"
                                                    ? handleEditUser(usr._id, "staff")
                                                    : handleEditCustomer(usr._id)
                                            }
                                            className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-md transition-all shadow-sm hover:shadow-md"
                                        >
                                            <UserCog size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleresetPassword(usr._id)
                                            }
                                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-all shadow-sm hover:shadow-md"
                                        >
                                            <RefreshCcw size={16} /> Reset
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </AnimatePresence>
                </table>

                {/* Empty State */}
                {(activeTab === "staff"
                    ? staff.filter((s) => s.email !== user?.email).length === 0
                    : customers.length === 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-gray-500 text-center py-10 text-base bg-gradient-to-b from-gray-50 to-white"
                        >
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
                                alt="Empty"
                                className="w-20 mx-auto mb-3 opacity-70"
                            />
                            No {activeTab === "staff" ? "staff members" : "customers"} found.
                        </motion.div>
                    )}
            </div>
        </AdminLayout>
    );
};

export default AdminStaffCustomers;
