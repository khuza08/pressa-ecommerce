// src/components/CategoryDropdown.tsx
"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

interface Category {
    name: string;
    subcategories: string[];
    banner?: string; // optional banner image
}

const categories: Category[] = [
    {
        name: "Electronics",
        subcategories: ["Desktop", "Laptop", "Camera", "Tablet", "Headphone"],
        banner: "/assets/images/electronics-banner-1.jpg",
    },
    {
        name: "Men's",
        subcategories: ["Formal", "Casual", "Sports", "Jacket", "Sunglasses"],
        banner: "/assets/images/mens-banner.jpg",
    },
    {
        name: "Women's",
        subcategories: ["Formal", "Casual", "Perfume", "Cosmetics", "Bags"],
        banner: "/assets/images/womens-banner.jpg",
    },
    {
        name: "Electronics (2)",
        subcategories: ["Smart Watch", "Smart TV", "Keyboard", "Mouse", "Microphone"],
        banner: "/assets/images/electronics-banner-2.jpg",
    },
];

export default function CategoryDropdown({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    if (!isOpen) return null;

    const toggleExpand = (name: string) => {
        setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div className="absolute top-full left-0 w-screen bg-white shadow-xl z-50 mt-2">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {categories.map((cat) => (
                        <div key={cat.name} className="space-y-4">
                            <h3 className="font-bold text-lg">{cat.name}</h3>
                            <ul className="space-y-2">
                                {cat.subcategories.map((sub) => (
                                    <li key={sub}>
                                        <a href="#" className="text-gray-600 hover:text-black block">
                                            {sub}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {cat.banner && (
                                <a href="#" className="block mt-4">
                                    <img
                                        src={cat.banner}
                                        alt={`${cat.name} banner`}
                                        className="rounded-lg"
                                    />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}