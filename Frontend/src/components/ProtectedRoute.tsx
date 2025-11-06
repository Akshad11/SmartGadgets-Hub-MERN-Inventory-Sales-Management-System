// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: ("admin" | "staff" | "customer")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
}) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Restoring session...
            </div>
        );
    }

    if (!isAuthenticated) {
        // 👇 Smart redirect based on role target
        const loginPath = allowedRoles.includes("admin") || allowedRoles.includes("staff")
            ? "/staff/login"
            : "/login";
        return <Navigate to={loginPath} replace />;
    }

    if (!allowedRoles.includes(user!.role)) return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;
