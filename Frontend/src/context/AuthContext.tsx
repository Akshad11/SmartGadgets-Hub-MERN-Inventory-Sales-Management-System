// src/context/AuthContext.tsx
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "staff" | "customer";
    phone?: string;
    address?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    updateUser: (updatedData: Partial<User>) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // 🔄 Load session from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
            } catch {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }

        setLoading(false);
    }, []);

    // 🔑 Login & store session
    const login = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        console.log("User logged in:", userData);
    };

    // 🧠 Update user data (e.g. profile edit or shipping info)
    const updateUser = (updatedData: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    // 🚪 Logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                updateUser,
                logout,
                isAuthenticated: !!user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
