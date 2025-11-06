// src/components/ImageCarousel.tsx
import React, { useState, useEffect } from "react";

const carouselImages = [
    {
        src: "https://images.unsplash.com/photo-1698729616509-060e8f58e6c0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1176",
        caption: "Smart Watches – Flat 50% OFF ⌚",
    },
    {
        src: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1920&q=80",
        caption: "Next-Gen Smartphones – Power Meets Style 📱",
    },
    {
        src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1332",
        caption: "Wireless Earbuds – Feel the Beat 🎧",
    },
    {
        src: "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1920&q=80",
        caption: "Smart Home Devices – Upgrade Your Life 🏠",
    },
    {
        src: "https://plus.unsplash.com/premium_photo-1723618843523-60df029319ce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1196",
        caption: "Gaming Accessories – Play Like a Pro 🎮",
    },
];

const ImageCarousel: React.FC = () => {
    const [current, setCurrent] = useState(0);

    // Auto slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[50vh] md:h-screen overflow-hidden">
            {/* Images */}
            {carouselImages.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <img
                        src={item.src}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                    />
                    {/* Caption Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-6">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold drop-shadow-md">
                            {item.caption}
                        </h2>
                        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                            Shop Now
                        </button>
                    </div>
                </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {carouselImages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-3 h-3 rounded-full transition-all ${current === i ? "bg-blue-600 scale-125" : "bg-white/60 hover:bg-white"
                            }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() =>
                    setCurrent((prev) =>
                        prev === 0 ? carouselImages.length - 1 : prev - 1
                    )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
            >
                ❮
            </button>

            <button
                onClick={() =>
                    setCurrent((prev) => (prev + 1) % carouselImages.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
            >
                ❯
            </button>
        </div>
    );
};

export default ImageCarousel;
