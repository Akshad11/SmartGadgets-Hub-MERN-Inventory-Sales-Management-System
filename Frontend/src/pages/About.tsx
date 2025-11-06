import React from "react";
import { motion } from "framer-motion";
import CustomerLayout from "../layout/CustomerLayout";
import { Github, Linkedin, Globe, Mail } from "lucide-react";

const About: React.FC = () => {
    return (
        <CustomerLayout>
            <div className="bg-gray-50 min-h-screen py-12 px-6">
                <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">About Me</h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            A quick story about <span className="text-blue-600 font-semibold">who I am</span> and why I built <span className="font-semibold">SmartGadgets Hub</span>.
                        </p>
                    </motion.div>

                    {/* Founder Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex flex-col md:flex-row items-center gap-8"
                    >
                        <img
                            src="https://api.dicebear.com/8.x/initials/svg?seed=Akshad%20Dhole"
                            alt="Akshad Dhole"
                            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
                        />
                        <div className="flex-1 text-gray-700">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                Hi, I'm <span className="text-blue-600">Akshad Dhole 👋</span>
                            </h2>
                            <p className="leading-relaxed">
                                I’m a <b>Software Developer</b> with over <b>2 years of professional experience</b>
                                in full-stack development. I completed my <b>B.Sc. in Computer Science</b> and
                                currently work in a software company where I develop and maintain systems
                                in multiple languages — from <b>Pascal</b> to modern stacks like <b>React,
                                    Node.js, and Flutter</b>.
                            </p>

                            <p className="mt-3 leading-relaxed">
                                Over time, I’ve built multiple projects — including <b>chat applications, task
                                    managers, eCommerce platforms,</b> and <b>AI experiments</b>. Each one pushed me
                                closer to mastering the craft of building smooth, intelligent, and real-world
                                products.
                            </p>

                            <p className="mt-3 leading-relaxed">
                                <b>SmartGadgets Hub</b> started as a personal project — an effort to combine everything I’ve learned into a fully-functional,
                                scalable, and visually appealing eCommerce ecosystem. From admin dashboards to live order management and customer pages,
                                it represents my vision of clean design, structured code, and seamless user experience.
                            </p>
                        </div>
                    </motion.div>

                    {/* Mission Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mt-12"
                    >
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                            My Mission 🚀
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            My goal is simple — to build software that doesn’t just work, but *feels right*.
                            I believe in intuitive interfaces, elegant logic, and a developer experience
                            that encourages constant improvement.
                            <br />
                            <br />
                            SmartGadgets Hub is not just a website — it’s a showcase of my
                            development philosophy: <b>clean code, real functionality, and delightful UI.</b>
                        </p>
                    </motion.div>

                    {/* What’s Inside */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mt-12"
                    >
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                            What’s Inside This Project 💡
                        </h3>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                            <li>🛍️ A modern eCommerce platform with customer, staff, and admin portals.</li>
                            <li>⚙️ Complete backend built with Express + MongoDB.</li>
                            <li>💬 Real-time updates using WebSockets.</li>
                            <li>📊 Powerful dashboards with analytics, reports, and exports.</li>
                            <li>🧾 Authentication, product management, orders, returns, and more.</li>
                            <li>🎨 Sleek UI designed with Tailwind CSS + Framer Motion for animations.</li>
                        </ul>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Connect With Me 🌐</h3>
                        <div className="flex justify-center gap-6">
                            <a
                                href="https://github.com/AkshadDhole"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                            >
                                <Github size={20} /> GitHub
                            </a>
                            <a
                                href="https://linkedin.com/in/akshad-dhole"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition"
                            >
                                <Linkedin size={20} /> LinkedIn
                            </a>
                            <a
                                href="mailto:akshaddhole@example.com"
                                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
                            >
                                <Mail size={20} /> Email
                            </a>
                            <a
                                href="https://smartgadgetshub.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                            >
                                <Globe size={20} /> Portfolio
                            </a>
                        </div>
                    </motion.div>

                    {/* Footer Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mt-12 text-center text-gray-600 text-sm"
                    >
                        <p>
                            “I built this platform not just as a website — but as a reflection of what I love:
                            <br /> bringing ideas to life through clean, purposeful code.”
                        </p>
                    </motion.div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default About;
