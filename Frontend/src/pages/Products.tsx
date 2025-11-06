import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerLayout from "../layout/CustomerLayout";
import api from "../api/axiosInstance";
import type { IProduct } from "../types";

interface MetaData {
    brands: string[];
    categories: string[];
}

const Products: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filtered, setFiltered] = useState<IProduct[]>([]);
    const [meta, setMeta] = useState<MetaData>({ brands: [], categories: [] });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [priceRange, setPriceRange] = useState<number>(300000);
    const [sortBy] = useState<string>("newest");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({
        category: true,
        brand: false,
        price: false,
        sort: false,
    });
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    // Parse query params (e.g., ?brand=Apple&category=Laptops)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const brandParam = params.get("brand");
        const categoryParam = params.get("category");

        if (brandParam) setSelectedBrand(brandParam);
        if (categoryParam) setSelectedCategory(categoryParam);
    }, [location.search]);

    // Fetch products & meta
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, metaRes] = await Promise.all([
                    api.get("/products"),
                    api.get("/products/meta"),
                ]);
                setProducts(productRes.data);
                setFiltered(productRes.data);
                setMeta(metaRes.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Apply filters
    useEffect(() => {
        let result = [...products];

        if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
        if (selectedCategory)
            result = result.filter((p) => p.category === selectedCategory);
        if (searchTerm)
            result = result.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        result = result.filter((p) => p.price <= priceRange);
        if (inStockOnly) result = result.filter((p) => p.stock > 0);

        if (sortBy === "lowToHigh") result.sort((a, b) => a.price - b.price);
        else if (sortBy === "highToLow") result.sort((a, b) => b.price - a.price);
        else if (sortBy === "newest") result.reverse();

        setFiltered(result);
    }, [
        selectedBrand,
        selectedCategory,
        searchTerm,
        priceRange,
        sortBy,
        inStockOnly,
        products,
    ]);

    const toggleSection = (key: string) =>
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

    if (loading)
        return (
            <CustomerLayout>
                <div className="text-center py-20 text-gray-500 animate-pulse">
                    Loading products...
                </div>
            </CustomerLayout>
        );

    return (
        <CustomerLayout>
            <div className="flex flex-col md:flex-row gap-6 px-6 py-8 bg-gray-50 min-h-screen transition-all duration-500">
                {/* Sidebar */}
                <motion.aside
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`bg-white shadow-md rounded-2xl p-5 w-full md:w-72 h-fit md:sticky md:top-20 transition-all duration-300 ${sidebarOpen ? "block" : "hidden md:block"
                        }`}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <Filter size={18} /> Filters
                        </h2>
                        <button
                            className="text-sm text-blue-600 hover:underline md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            Close
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Search
                            size={16}
                            className="absolute left-3 top-3 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="space-y-3">
                        {/* Category */}
                        <div>
                            <button
                                onClick={() => toggleSection("category")}
                                className="w-full flex justify-between items-center py-2 font-medium text-gray-700 hover:text-blue-600"
                            >
                                Category{" "}
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expanded.category ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {expanded.category && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="pl-2 flex flex-col gap-1 mt-1"
                                    >
                                        <button
                                            className={`text-left text-sm px-2 py-1 rounded-md ${!selectedCategory
                                                ? "bg-blue-100 text-blue-600"
                                                : "hover:bg-gray-100"
                                                }`}
                                            onClick={() => setSelectedCategory("")}
                                        >
                                            All
                                        </button>
                                        {meta.categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`text-left text-sm px-2 py-1 rounded-md ${selectedCategory === cat
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Brand */}
                        <div>
                            <button
                                onClick={() => toggleSection("brand")}
                                className="w-full flex justify-between items-center py-2 font-medium text-gray-700 hover:text-blue-600"
                            >
                                Brand{" "}
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expanded.brand ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {expanded.brand && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="pl-2 flex flex-col gap-1 mt-1"
                                    >
                                        <button
                                            className={`text-left text-sm px-2 py-1 rounded-md ${!selectedBrand
                                                ? "bg-blue-100 text-blue-600"
                                                : "hover:bg-gray-100"
                                                }`}
                                            onClick={() => setSelectedBrand("")}
                                        >
                                            All
                                        </button>
                                        {meta.brands.map((brand) => (
                                            <button
                                                key={brand}
                                                onClick={() => setSelectedBrand(brand)}
                                                className={`text-left text-sm px-2 py-1 rounded-md ${selectedBrand === brand
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "hover:bg-gray-100"
                                                    }`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Price Range */}
                        <div>
                            <button
                                onClick={() => toggleSection("price")}
                                className="w-full flex justify-between items-center py-2 font-medium text-gray-700 hover:text-blue-600"
                            >
                                Price Range{" "}
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expanded.price ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {expanded.price && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="pl-2 mt-2"
                                    >
                                        <input
                                            type="range"
                                            min={0}
                                            max={300000}
                                            step={1500}
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(Number(e.target.value))}
                                            className="w-full accent-blue-600"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Up to ₹{priceRange.toLocaleString()}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* In Stock Only */}
                        <div className="flex items-center gap-2 mt-3">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                                className="accent-blue-600"
                            />
                            <span className="text-sm text-gray-700">In stock only</span>
                        </div>
                    </div>
                </motion.aside>

                {/* Products Grid */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex-1"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Explore Our Products
                        </h1>
                        <button
                            className="md:hidden bg-blue-600 text-white px-3 py-2 rounded-md"
                            onClick={() => setSidebarOpen(true)}
                        >
                            Filters
                        </button>
                    </div>

                    {filtered.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">
                            No products found.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filtered.map((p) => (
                                <motion.div
                                    key={p._id}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
                                    onClick={() => navigate(`/product/${p._id}`)}
                                >
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="w-full h-44 object-cover rounded-t-xl"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-800 truncate">
                                            {p.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{p.brand}</p>
                                        <p className="text-blue-600 font-semibold mt-1">
                                            ₹{p.price.toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>
        </CustomerLayout>
    );
};

export default Products;
