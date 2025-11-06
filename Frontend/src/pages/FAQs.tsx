import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import CustomerLayout from "../layout/CustomerLayout";

const faqs = [
    {
        question: "What payment methods do you accept?",
        answer:
            "We accept all major credit and debit cards, UPI, PayPal, and net banking. All transactions are securely processed through encrypted gateways.",
    },
    {
        question: "How long will delivery take?",
        answer:
            "Delivery usually takes 3–7 business days, depending on your location. You can track your order status in the 'My Orders' section once it’s shipped.",
    },
    {
        question: "Can I return or exchange a product?",
        answer:
            "Yes, you can request a return or exchange within 7 days of delivery. The product must be unused, undamaged, and in its original packaging.",
    },
    {
        question: "How can I cancel my order?",
        answer:
            "Orders can be canceled before shipment. Visit the 'My Orders' page, select the order, and click 'Cancel'. If already shipped, you can request a return.",
    },
    {
        question: "Is there any warranty on products?",
        answer:
            "Most of our products come with a manufacturer’s warranty. The duration varies by brand — details are mentioned on each product page.",
    },
    {
        question: "Do you offer international shipping?",
        answer:
            "Currently, we ship only within India. However, we are working on expanding to international locations soon!",
    },
    {
        question: "What if I receive a damaged product?",
        answer:
            "We’re very sorry if that happens. Please contact our support team with photos within 48 hours of delivery, and we’ll arrange a replacement immediately.",
    },
    {
        question: "How can I contact customer support?",
        answer:
            "You can reach us via email at support@smartgadgets.com or through the 'Contact Us' page. Our support team is available 9AM–8PM, all days.",
    },
];

const FAQs: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <CustomerLayout>
            <div className="bg-gray-50 min-h-screen py-12 px-6">
                <div className="max-w-4xl mx-auto text-center mb-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold text-gray-800 mb-2"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Find quick answers to the most common questions about orders, payments, and more.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl divide-y divide-gray-200">
                    {faqs.map((faq, index) => (
                        <div key={index} className="p-5">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex justify-between items-center text-left"
                            >
                                <span className="font-semibold text-gray-800 text-base sm:text-lg">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="text-gray-500" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default FAQs;
