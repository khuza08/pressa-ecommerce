// src/components/CategorySidebar.tsx
"use client";

import { useState } from "react";
import {
    FiX,
    FiPlus,
    FiMinus,
    FiStar,
} from "react-icons/fi";
import { BsStarHalf } from "react-icons/bs";

interface Category {
    name: string;
    icon: React.ReactNode;
    subcategories?: string[];
}

const categories: Category[] = [
    {
        name: "Clothes",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
            </svg>
        ),
        subcategories: ["Shirt", "Shorts & Jeans", "Jacket", "Dress & Frock"],
    },
    {
        name: "Footwear",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h10v-2H5V7h14v2h2V7a2 2 0 00-2-2z" />
            </svg>
        ),
        subcategories: ["Sports", "Formal", "Casual", "Safety Shoes"],
    },
    {
        name: "Jewelry",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
            </svg>
        ),
        subcategories: ["Earrings", "Couple Rings", "Necklace", "Bracelets"],
    },
    {
        name: "Perfume",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 10h-1.264A6 6 0 106 10H4.736A6 6 0 1018 10z" />
            </svg>
        ),
        subcategories: ["Clothes Perfume", "Deodorant", "Flower Fragrance", "Air Freshener"],
    },
    {
        name: "Cosmetics",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
            </svg>
        ),
        subcategories: ["Shampoo", "Sunscreen", "Body Wash", "Makeup Kit"],
    },
    {
        name: "Glasses",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
            </svg>
        ),
        subcategories: ["Sunglasses", "Lenses"],
    },
    {
        name: "Bags",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
            </svg>
        ),
        subcategories: ["Shopping Bag", "Gym Backpack", "Purse", "Wallet"],
    },
];

const bestSellers = [
    {
        name: "Baby Fabric Shoes",
        price: "$4.00",
        originalPrice: "$5.00",
        rating: 5,
        image: "/assets/images/products/1.jpg",
    },
    {
        name: "Men's Hoodies T-Shirt",
        price: "$7.00",
        originalPrice: "$17.00",
        rating: 4.5,
        image: "/assets/images/products/2.jpg",
    },
    {
        name: "Girls T-Shirt",
        price: "$3.00",
        originalPrice: "$5.00",
        rating: 4.5,
        image: "/assets/images/products/3.jpg",
    },
    {
        name: "Woolen Hat For Men",
        price: "$12.00",
        originalPrice: "$15.00",
        rating: 5,
        image: "/assets/images/products/4.jpg",
    },
];

export default function CategorySidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    if (!isOpen) return null;

    const toggleExpand = (name: string) => {
        setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<FiStar key={i} className="text-yellow-400" />);
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                stars.push(<BsStarHalf key={i} className="text-yellow-400" />);
            } else {
                stars.push(<FiStar key={i} className="text-black/30" />);
            }
        }
        return stars;
    };

    return (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-bold text-black">CATEGORY</h2>
                <button onClick={onClose} className="text-black" aria-label="Close category sidebar">
                    <FiX className="text-2xl" />
                </button>
            </div>

            {/* Categories List */}
            <div className="p-4 space-y-4">
                {categories.map((cat) => (
                    <div key={cat.name} className="border-b pb-4 last:border-b-0">
                        <button
                            className="flex justify-between items-center w-full py-2 font-medium text-black"
                            onClick={() => toggleExpand(cat.name)}
                        >
                            <div className="flex items-center space-x-2">
                                {cat.icon}
                                <span>{cat.name}</span>
                            </div>
                            {expanded[cat.name] ? (
                                <FiMinus className="text-lg" />
                            ) : (
                                <FiPlus className="text-lg" />
                            )}
                        </button>
                        {expanded[cat.name] && cat.subcategories && (
                            <ul className="pl-6 mt-2 space-y-1 text-sm text-black/60">
                                {cat.subcategories.map((sub) => (
                                    <li key={sub}>
                                        <a href="#" className="block py-1 hover:text-black">
                                            {sub}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Best Sellers */}
            <div className="p-4 pt-0">
                <h3 className="font-bold mb-4">BEST SELLERS</h3>
                <div className="space-y-4">
                    {bestSellers.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                    {renderStars(item.rating)}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-sm line-through text-black/50">${item.originalPrice}</span>
                                    <span className="text-sm font-bold text-green-600">${item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}