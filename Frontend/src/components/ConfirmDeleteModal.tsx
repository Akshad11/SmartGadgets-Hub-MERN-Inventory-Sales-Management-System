import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    title = "Delete Product?",
    message = "Are you sure you want to delete this product? This action cannot be undone.",
    onConfirm,
    onCancel,
    loading = false,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        initial={{ opacity: 0, scale: 0.8, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", duration: 0.4 }}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 text-center relative">
                            {/* Close Button */}
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                                onClick={onCancel}
                            >
                                <X size={20} />
                            </button>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                className="bg-red-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4"
                            >
                                <Trash2 className="text-red-600 w-8 h-8" />
                            </motion.div>

                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
                            <p className="text-gray-500 mb-6">{message}</p>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={onCancel}
                                    disabled={loading}
                                    className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className={`px-5 py-2 rounded-lg font-medium text-white shadow-md transition ${loading
                                            ? "bg-red-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700"
                                        }`}
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDeleteModal;
