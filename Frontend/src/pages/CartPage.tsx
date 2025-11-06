// src/pages/CartPage.tsx
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../layout/CustomerLayout";

const CartPage: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <CustomerLayout>
                <div className="text-center py-20 text-gray-500">
                    🛒 Your cart is empty
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-6">
                <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

                <div className="space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item._id}
                            className="flex flex-col sm:flex-row items-center justify-between border-b pb-4"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-20 h-20 rounded-md object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.category}</p>
                                    <p className="text-blue-600 font-bold mt-1">
                                        ₹{item.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <div className="flex items-center gap-2 border rounded-md px-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="text-lg px-2 hover:text-blue-600"
                                    >
                                        -
                                    </button>
                                    <span className="px-2">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="text-lg px-2 hover:text-blue-600"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-lg font-semibold text-gray-700">
                        Total: ₹{totalAmount.toLocaleString()}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={clearCart}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={() => navigate("/checkout")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default CartPage;
