// src/layout/AdminLayout.tsx
import React from "react";
import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-gray-100 min-h-screen flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-6 transition-all duration-300">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
