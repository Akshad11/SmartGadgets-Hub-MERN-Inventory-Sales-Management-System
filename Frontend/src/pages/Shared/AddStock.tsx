import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axiosInstance";
import type { IProduct } from "../../types";
import Breadcrumb from "../../components/Breadcrumb";
import { PackagePlus, Loader2 } from "lucide-react";

const AddStock: React.FC = () => {
    const { token, user } = useAuth();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filtered, setFiltered] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterLowStock, setFilterLowStock] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [addAmount, setAddAmount] = useState<number>(0);
    const [saving, setSaving] = useState(false);

    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get<IProduct[]>("/products", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts(res.data);
                setFiltered(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [token]);

    // Filter logic
    useEffect(() => {
        let result = products;
        if (search.trim()) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterLowStock) {
            result = result.filter((p) => p.stock < 10);
        }
        setFiltered(result);
    }, [search, filterLowStock, products]);

    // Update stock handler
    const handleAddStock = async () => {
        if (!selectedProduct || addAmount <= 0) return;
        setSaving(true);

        try {
            const newStock = selectedProduct.stock + addAmount;
            await api.put(
                `/products/${selectedProduct._id}`,
                { stock: newStock },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updated = products.map((p) =>
                p._id === selectedProduct._id ? { ...p, stock: newStock } : p
            );
            setProducts(updated);
            setFiltered(updated);
            setSelectedProduct(null);
            setAddAmount(0);
        } catch (err: any) {
            console.error(err);
            alert("Failed to update stock");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
                <Loader2 className="animate-spin w-8 h-8 mb-2 text-blue-500" />
                Loading products...
            </div>
        );

    return (
        <div
            className={`min-h-screen p-6 transition-all ${isAdmin
                    ? "bg-gradient-to-b from-gray-50 to-white"
                    : "bg-gradient-to-b from-green-50 to-white"
                }`}
        >
            <Breadcrumb
                items={[
                    {
                        label: "Dashboard",
                        path: isAdmin ? "/admin/dashboard" : "/staff/dashboard",
                    },
                    {
                        label: "Products",
                        path: isAdmin ? "/admin/products" : "/staff/products",
                    },
                    { label: "Add Stock" },
                ]}
            />

            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h1
                        className={`text-3xl font-semibold flex items-center gap-2 ${isAdmin ? "text-gray-800" : "text-green-700"
                            }`}
                    >
                        <PackagePlus
                            className={`${isAdmin ? "text-blue-600" : "text-green-600"}`}
                        />{" "}
                        Add Stock ({isAdmin ? "Admin" : "Staff"})
                    </h1>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6 items-center">
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border rounded-md w-64 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <label className="flex items-center gap-2 text-gray-700">
                        <input
                            type="checkbox"
                            checked={filterLowStock}
                            onChange={(e) => setFilterLowStock(e.target.checked)}
                            className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm">
                            Show only low stock (&lt;10)
                        </span>
                    </label>
                </div>

                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Product Table */}
                <div
                    className={`rounded-2xl overflow-hidden shadow-sm border ${isAdmin ? "border-gray-200 bg-white" : "border-green-100 bg-white"
                        }`}
                >
                    <table className="min-w-full text-sm">
                        <thead
                            className={`${isAdmin
                                    ? "bg-gradient-to-r from-blue-50 to-blue-100"
                                    : "bg-gradient-to-r from-green-50 to-green-100"
                                }`}
                        >
                            <tr>
                                <th className="px-4 py-3 text-left">Product Name</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Stock</th>
                                <th className="px-4 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filtered.map((p, i) => (
                                    <motion.tr
                                        key={p._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-3">
                                            <img
                                                src={p.imageUrl || "https://via.placeholder.com/40"}
                                                alt={p.name}
                                                className="w-10 h-10 object-cover rounded-lg shadow-sm"
                                            />
                                            {p.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{p.category}</td>
                                        <td
                                            className={`px-4 py-3 font-semibold ${p.stock < 10 ? "text-red-600" : "text-gray-700"
                                                }`}
                                        >
                                            {p.stock}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedProduct(p)}
                                                className={`px-3 py-1.5 rounded-md text-white shadow-sm transition ${isAdmin
                                                        ? "bg-blue-600 hover:bg-blue-700"
                                                        : "bg-green-600 hover:bg-green-700"
                                                    }`}
                                            >
                                                ➕ Add Stock
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="text-center text-gray-500 py-6">
                            No products found.
                        </div>
                    )}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 40 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 40 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className={`rounded-2xl p-6 w-96 shadow-xl ${isAdmin
                                        ? "bg-white border border-blue-100"
                                        : "bg-white border border-green-100"
                                    }`}
                            >
                                <h3 className="text-lg font-semibold mb-2 text-center text-gray-800">
                                    Add Stock for{" "}
                                    <span
                                        className={`${isAdmin ? "text-blue-600" : "text-green-600"
                                            }`}
                                    >
                                        {selectedProduct.name}
                                    </span>
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 text-center">
                                    Current Stock: <b>{selectedProduct.stock}</b>
                                </p>

                                <input
                                    type="number"
                                    placeholder="Enter amount to add"
                                    value={addAmount}
                                    onChange={(e) => setAddAmount(Number(e.target.value))}
                                    className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
                                    min={1}
                                />

                                <div className="flex justify-end gap-3">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                                        onClick={() => setSelectedProduct(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-md text-white shadow-md transition ${isAdmin
                                                ? "bg-blue-600 hover:bg-blue-700"
                                                : "bg-green-600 hover:bg-green-700"
                                            }`}
                                        onClick={handleAddStock}
                                        disabled={saving}
                                    >
                                        {saving ? "Updating..." : "Update Stock"}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default AddStock;
