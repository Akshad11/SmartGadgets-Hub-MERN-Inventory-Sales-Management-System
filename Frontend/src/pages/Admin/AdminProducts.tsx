import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layout/AdminLayout";
import type { IProduct } from "../../types";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Breadcrumb from "../../components/Breadcrumb";
import { Pencil, Trash2, PackagePlus, Plus } from "lucide-react";

const AdminProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await api.get("/products");
            setProducts(response.data);
        };
        fetchProducts();
    }, []);

    const handleAddProduct = () => navigate("/product/add");
    const handleAddStock = () => navigate("/add-stock");
    const handleEditProduct = (id: string) => navigate(`/product/edit/${id}`);

    const handleDelete = (id: string) => {
        setShowModal(true);
        setSelectedId(id);
    };

    const confirmDelete = async () => {
        if (!selectedId) return;
        setDeleting(true);
        try {
            await api.delete(`/products/${selectedId}`);
            setProducts((prev) => prev.filter((p) => p._id !== selectedId));
            setShowModal(false);
        } catch (error) {
            console.error("Error deleting product", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <AdminLayout>
            <Breadcrumb
                items={[
                    { label: "Dashboard", path: "/admin/dashboard" },
                    { label: "Products" },
                ]}
            />

            <ConfirmDeleteModal
                isOpen={showModal}
                onCancel={() => setShowModal(false)}
                onConfirm={confirmDelete}
                loading={deleting}
            />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Products</h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleAddProduct}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                    <button
                        onClick={handleAddStock}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition"
                    >
                        <PackagePlus size={18} /> Add Stock
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100/60">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                Product
                            </th>
                            <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                Category
                            </th>
                            <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                Stock
                            </th>
                            <th className="px-5 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
                                Price (₹)
                            </th>
                            <th className="px-5 py-3 text-center font-semibold text-gray-700 uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <AnimatePresence>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((p, index) => (
                                <motion.tr
                                    key={p._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        delay: index * 0.03,
                                        duration: 0.3,
                                        type: "spring",
                                        stiffness: 120,
                                    }}
                                    className="group cursor-pointer transition-all duration-300 hover:bg-blue-50/40 hover:shadow-sm hover:scale-[1.005]"
                                >
                                    {/* Product with Image */}
                                    <td className="px-5 py-3 flex items-center gap-4 text-gray-800 font-medium rounded-l-xl">
                                        <motion.img
                                            src={p.imageUrl || "https://via.placeholder.com/60"}
                                            alt={p.name}
                                            className="w-12 h-12 rounded-md object-cover border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{p.name}</p>
                                            <p className="text-xs text-gray-500">{p.brand}</p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-3 text-gray-600">{p.category}</td>

                                    <td
                                        className={`px-5 py-3 font-medium ${p.stock < 10
                                                ? "text-red-500 bg-red-50/50 rounded-md"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        {p.stock}
                                    </td>

                                    <td className="px-5 py-3 font-semibold text-gray-800">
                                        ₹{p.price.toLocaleString()}
                                    </td>

                                    {/* Action Buttons */}
                                    <td className="px-5 py-3 text-center flex justify-center gap-2 rounded-r-xl">
                                        <button
                                            onClick={() => handleEditProduct(p._id)}
                                            className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-md transition-all shadow-sm hover:shadow-md"
                                        >
                                            <Pencil size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p._id)}
                                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-all shadow-sm hover:shadow-md"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </AnimatePresence>
                </table>

                {/* Empty State */}
                {products.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-500 text-center py-10 text-base bg-gradient-to-b from-gray-50 to-white"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
                            alt="Empty"
                            className="w-20 mx-auto mb-3 opacity-70"
                        />
                        You haven’t added any products yet.
                    </motion.div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
