// src/components/Navbar.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuth();
    const { cart } = useCart();

    const cartCount = cart.length;

    return (
        <nav className="sticky top-0 z-[60] bg-white/70 backdrop-blur-md shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center transition-all duration-300">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-extrabold text-blue-600 tracking-tight hover:opacity-80 transition-opacity"
                >
                    SmartGadgets <span className="text-indigo-600">Hub</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10 text-[15px]">
                    <Link
                        to="/"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200"
                    >
                        Home
                    </Link>
                    <Link
                        to="/products"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200"
                    >
                        Products
                    </Link>

                    {/* 🛒 Cart */}
                    <Link
                        to="/cart"
                        className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                        <ShoppingCart size={20} />
                        Cart
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold px-2 py-[1px] rounded-full shadow-md animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* 👤 User Section */}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-blue-600 transition"
                                onClick={() => navigate("/profile")}
                            >
                                <img
                                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`}
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full border"
                                />
                                <span className="font-medium">
                                    Hi, {user?.name.split(" ")[0] || "User"}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate("/login");
                                }}
                                className="text-gray-600 hover:text-red-500 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            <User size={18} /> Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-700 hover:text-blue-600 transition"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* 🌙 Mobile Dropdown Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden absolute top-[100%] left-0 w-full bg-white shadow-lg border-t z-[70]"
                    >
                        <div className="flex flex-col items-start px-6 py-5 gap-5">
                            <Link
                                to="/"
                                onClick={() => setMenuOpen(false)}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Home
                            </Link>
                            <Link
                                to="/products"
                                onClick={() => setMenuOpen(false)}
                                className="text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                Products
                            </Link>
                            <Link
                                to="/cart"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
                            >
                                <ShoppingCart size={18} /> Cart
                                {cartCount > 0 && (
                                    <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-[1px] rounded-full ml-1">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Authenticated Dropdown */}
                            {isAuthenticated ? (
                                <div className="flex flex-col w-full gap-3 relative z-[80]">
                                    {/* User Info */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate("/profile");
                                            setMenuOpen(false);
                                        }}
                                        className="flex items-center justify-between w-full bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer focus:outline-none"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`}
                                                alt="avatar"
                                                className="w-9 h-9 rounded-full border border-gray-300"
                                            />
                                            <div className="flex flex-col text-left">
                                                <span className="font-medium text-gray-800">
                                                    {user?.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {user?.email}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-blue-600 text-sm font-medium hover:underline">
                                            View
                                        </span>
                                    </button>

                                    {/* Logout */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            logout();
                                            navigate("/login");
                                            setMenuOpen(false);
                                        }}
                                        className="w-full text-center text-red-500 font-semibold hover:text-red-600 hover:bg-red-50 py-2 rounded-md transition focus:outline-none"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
                                >
                                    <User size={18} /> Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
