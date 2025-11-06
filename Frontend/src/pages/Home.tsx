// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import type { IProduct } from "../types";
import CustomerLayout from "../layout/CustomerLayout";
import ProductCard from "../components/ProductCard";
import ImageCarousel from "../components/ImageCarousel";
import BrandSlider from "../components/BrandSlider";
import CategorySlider from "../components/CategorySlider";
import FeaturedProducts from "../components/FeaturedProducts";

const Home: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                console.log(res.data);
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <CustomerLayout>
            <ImageCarousel />
            <BrandSlider />
            <FeaturedProducts />
            <CategorySlider />
            <h1 className="text-3xl text-center font-semibold p-6 mb-6">Latest Products</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            )}

        </CustomerLayout>
    );
};

export default Home;
