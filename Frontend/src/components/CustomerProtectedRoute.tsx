// src/components/CustomerProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface CustomerProtectedRouteProps {
    children: React.ReactNode;
}

const CustomerProtectedRoute: React.FC<CustomerProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    // Show loading UI if checking token/session
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Restoring session...
            </div>
        );
    }

    // Redirect if not logged in
    if (!isAuthenticated || user?.role !== "customer") {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }} // Save intended route
            />
        );
    }

    // If logged in → continue
    return children;
};

export default CustomerProtectedRoute;
