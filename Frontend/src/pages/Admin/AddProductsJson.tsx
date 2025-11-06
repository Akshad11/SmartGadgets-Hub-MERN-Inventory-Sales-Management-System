import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import api from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

interface Product {
    name: string;
    description?: string;
    brand?: string;
    category: string;
    price: number;
    stock: number;
    imageUrl?: string;
}

const AddProductsJson: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const json = JSON.parse(text);

            if (!Array.isArray(json)) {
                toast.error("Invalid file format. Expected an array of products.");
                return;
            }

            setProducts(json);
            toast.success(`Loaded ${json.length} products from JSON file.`);
        } catch (err) {
            toast.error("Invalid JSON file. Please check your file structure.");
            console.error(err);
        }
    };

    // Upload products one by one
    const handleUpload = async () => {
        if (products.length === 0) {
            toast.error("Please upload a JSON file first!");
            return;
        }

        setUploading(true);
        setProgress(0);
        setStatus("idle");

        try {
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                await api.post("/products", product);
                setProgress(((i + 1) / products.length) * 100);
            }

            setStatus("success");
            toast.success(`✅ Uploaded ${products.length} products successfully!`);
        } catch (error) {
            console.error("Upload failed:", error);
            setStatus("error");
            toast.error("Some uploads failed. Check console for details.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10"
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    📦 Bulk Add Products (JSON Upload)
                </h1>

                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 transition">
                        <Upload className="text-blue-500 w-10 h-10 mb-3" />
                        <p className="text-gray-600 mb-2">
                            Drag and drop a JSON file here or click below
                        </p>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            className="mt-2 cursor-pointer text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-200"
                        />
                    </div>

                    {products.length > 0 && (
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                            <p className="text-gray-800 font-medium">
                                Total Products Loaded:{" "}
                                <span className="text-blue-600 font-semibold">
                                    {products.length}
                                </span>
                            </p>
                            <ul className="mt-3 text-sm text-gray-600 max-h-32 overflow-y-auto border-t pt-2">
                                {products.slice(0, 5).map((p, i) => (
                                    <li key={i} className="truncate">
                                        • {p.name} ({p.category})
                                    </li>
                                ))}
                                {products.length > 5 && (
                                    <li className="text-gray-400 italic mt-1">
                                        ...and {products.length - 5} more
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            disabled={uploading || products.length === 0}
                            onClick={handleUpload}
                            className={`${uploading
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                } text-white font-semibold px-6 py-3 rounded-md shadow-md transition-all`}
                        >
                            {uploading ? "Uploading..." : "🚀 Upload Products"}
                        </button>
                    </div>

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.4 }}
                                className="bg-blue-600 h-3 rounded-full"
                            ></motion.div>
                            <p className="text-center text-sm text-gray-600 mt-2">
                                {Math.round(progress)}% uploaded
                            </p>
                        </div>
                    )}

                    {/* Upload Status */}
                    {status !== "idle" && !uploading && (
                        <div className="flex items-center justify-center mt-6">
                            {status === "success" ? (
                                <div className="flex items-center gap-2 text-green-600 font-medium">
                                    <CheckCircle size={20} /> All products uploaded successfully!
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600 font-medium">
                                    <AlertCircle size={20} /> Upload failed for some items.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </AdminLayout>
    );
};

export default AddProductsJson;
