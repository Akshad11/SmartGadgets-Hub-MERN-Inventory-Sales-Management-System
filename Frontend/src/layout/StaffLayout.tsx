import React from "react";
import SidebarStaff from "../components/SidebarStaff";

const StaffLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-gray-100 min-h-screen flex">
            {/* Sidebar (Fixed) */}
            <SidebarStaff />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-6 transition-all duration-300">
                {/* Optional: Sticky header or breadcrumbs can go here */}
                {children}
            </main>
        </div>
    );
};

export default StaffLayout;
