// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { IProduct } from "../types";

interface CartItem extends IProduct {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: IProduct, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    loading: boolean; // 👈 new
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // 🧠 Load from localStorage on first mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("cart");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) setCart(parsed);
            }
        } catch (err) {
            console.error("Failed to load cart from localStorage", err);
        }
        setLoading(false);
    }, []);

    // 💾 Save to localStorage whenever cart changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, loading]);

    // ➕ Add to cart
    const addToCart = (product: IProduct, quantity: number = 1) => {
        setCart((prev) => {
            const existing = prev.find((p) => p._id === product._id);
            if (existing) {
                return prev.map((p) =>
                    p._id === product._id ? { ...p, quantity: p.quantity + quantity } : p
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    // ❌ Remove item
    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((p) => p._id !== id));
    };

    // 🔄 Update quantity
    const updateQuantity = (id: string, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    // 🧹 Clear all
    const clearCart = () => {
        setCart([]);
    };

    // 💰 Total
    const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                Restoring cart...
            </div>
        );
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalAmount,
                loading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};
