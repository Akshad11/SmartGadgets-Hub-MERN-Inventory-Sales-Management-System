import React from "react";
import { motion } from "framer-motion";
import CustomerLayout from "../layout/CustomerLayout";

const PrivacyPolicy: React.FC = () => {
    return (
        <CustomerLayout>
            <div className="bg-gray-50 min-h-screen py-12 px-6">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
                    {/* Header */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold text-gray-800 mb-4 text-center"
                    >
                        Privacy Policy
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-center mb-8"
                    >
                        Last updated on {new Date().toLocaleDateString()}
                    </motion.p>

                    {/* Sections */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-8 text-gray-700 leading-relaxed"
                    >
                        <section>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                1. Introduction
                            </h2>
                            <p>
                                Welcome to <b>SmartGadgets Hub</b>. We respect your privacy and are
                                committed to protecting your personal information. This policy
                                explains how we collect, use, and safeguard your data when you visit
                                or make a purchase from our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                2. Information We Collect
                            </h2>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>
                                    <b>Personal Information:</b> Name, email, phone number, address,
                                    payment details.
                                </li>
                                <li>
                                    <b>Technical Data:</b> IP address, browser type, device details,
                                    and pages visited.
                                </li>
                                <li>
                                    <b>Cookies:</b> Small files used to improve your browsing experience
                                    and remember preferences.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                3. How We Use Your Information
                            </h2>
                            <p>
                                We use your information to process orders, provide customer support,
                                improve our services, and notify you about new offers or updates.
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>To process and deliver your purchases securely.</li>
                                <li>To communicate updates on order status or support queries.</li>
                                <li>To send marketing promotions (only with your consent).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                4. Data Protection
                            </h2>
                            <p>
                                We implement advanced encryption and security protocols to keep your
                                data safe. Your payment details are never stored on our servers and
                                are processed by trusted third-party payment gateways.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                5. Sharing Your Data
                            </h2>
                            <p>
                                We never sell or rent your personal data. We may share necessary
                                information with:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Payment service providers (for transaction processing)</li>
                                <li>Delivery partners (for order fulfillment)</li>
                                <li>Legal authorities (if required by law)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                6. Your Rights
                            </h2>
                            <p>
                                You have the right to access, modify, or delete your personal
                                information at any time. You can also opt-out of promotional emails
                                using the unsubscribe link.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                7. Cookies Policy
                            </h2>
                            <p>
                                Cookies help us personalize your shopping experience. You can manage
                                or disable cookies from your browser settings, but doing so may limit
                                site functionality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                8. Changes to This Policy
                            </h2>
                            <p>
                                We may update this privacy policy periodically. Any changes will be
                                reflected on this page with an updated “Last Modified” date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                9. Contact Us
                            </h2>
                            <p>
                                If you have questions about our privacy practices, please contact us
                                at:
                            </p>
                            <div className="bg-gray-100 p-3 mt-3 rounded-md border text-sm">
                                📧 <b>Email:</b> support@smartgadgets.com
                                <br />
                                📍 <b>Address:</b> SmartGadgets HQ, Mumbai, India
                            </div>
                        </section>
                    </motion.div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default PrivacyPolicy;
