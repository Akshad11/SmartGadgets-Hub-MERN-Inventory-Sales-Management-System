// src/layout/CustomerLayout.tsx
import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Banner />
            <main className="flex-1 bg-gray-50">{children}</main>
            <Footer />
        </div>
    );
};

export default CustomerLayout;
