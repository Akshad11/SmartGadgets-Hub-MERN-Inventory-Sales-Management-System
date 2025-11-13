import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    const socialLinks = [
        { icon: <Facebook size={18} />, href: "https://facebook.com" },
        { icon: <Instagram size={18} />, href: "https://instagram.com" },
        { icon: <Twitter size={18} />, href: "https://twitter.com" },
        { icon: <Linkedin size={18} />, href: "https://linkedin.com" },
        { icon: <Mail size={18} />, href: "mailto:support@smartgadgets.com" },
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Brand Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">SmartGadgets</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Discover the latest tech at unbeatable prices.
                        Your trusted store for gadgets, electronics, and innovation.
                    </p>

                    <div className="flex gap-3 mt-4">
                        {socialLinks.map((s, i) => (
                            <motion.a
                                key={i}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2 }}
                                className="p-2 bg-white border rounded-full text-gray-700 hover:text-blue-600 hover:border-blue-500 transition"
                            >
                                {s.icon}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                        </li>
                        <li>
                            <Link to="/products" className="hover:text-blue-600 transition">Shop</Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-blue-600 transition">About Me</Link>
                        </li>
                        <li>
                            <Link to="/staff/login" className="hover:text-blue-600 transition">Staff Login</Link>
                        </li>
                    </ul>
                </motion.div>

                {/* Customer Service */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Service</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link to="/orders" className="hover:text-blue-600 transition">My Orders</Link></li>
                        <li><Link to="/faq" className="hover:text-blue-600 transition">FAQs</Link></li>
                        <li><Link to="/returns" className="hover:text-blue-600 transition">Returns</Link></li>
                        <li><Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
                    </ul>
                </motion.div>

                {/* Newsletter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Stay Updated</h3>
                    <p className="text-gray-600 text-sm mb-3">
                        Subscribe to get updates on new arrivals, discounts, and offers.
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert("✅ Subscribed successfully!");
                        }}
                        className="flex flex-col sm:flex-row gap-2"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                            Subscribe
                        </button>
                    </form>
                </motion.div>
            </div>

            <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
                © {new Date().getFullYear()} SmartGadgets. All rights reserved. |
                <Link to="/about" className="text-blue-600 hover:underline ml-1">
                    About Me
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
