// src/components/Banner.tsx
import React from "react";

const Banner: React.FC = () => {
    return (
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
            <div className="py-3 whitespace-nowrap animate-marquee">
                <span className="mx-8 text-sm sm:text-base font-medium">
                    🔥 Mega Sale! 50% OFF on Smart Watches ⌚ | Free Shipping on Orders Above ₹999 🚚 | Grab Your Gadgets Now ⚡
                </span>
                <span className="mx-8 text-sm sm:text-base font-medium">
                    🎉 New Arrivals: Latest Smartphones & Accessories Available Now 📱 | Limited Time Offer 💥
                </span>
            </div>
        </div>
    );
};

export default Banner;
