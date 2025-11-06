// src/components/Sidebar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, LogOut, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const Sidebar: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const links = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
        { name: "Staff / Customers", path: "/admin/staff-customers", icon: <Users size={20} /> },
        { name: "Reports", path: "/admin/reports", icon: <BarChart3 size={20} /> },
    ];

    return (
        <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex flex-col justify-between shadow-xl fixed left-0 top-0">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-6 border-b border-gray-700 text-center"
            >
                <h1 className="text-xl font-semibold text-white tracking-wide">
                    SmartGadgets Admin
                </h1>
                <p className="text-xs text-gray-400 mt-1 uppercase">{user?.role || "Admin"}</p>
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                {links.map((link, index) => (
                    <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <NavLink
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "hover:bg-gray-700 hover:text-white text-gray-300"
                                }`
                            }
                        >
                            <span className="text-gray-300">{link.icon}</span>
                            <span>{link.name}</span>
                        </NavLink>
                    </motion.div>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700 bg-gray-900/70">
                <button
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
