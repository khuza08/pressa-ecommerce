// src/components/CategorySidebar.tsx
"use client";

import { useState, useEffect } from "react";
import {
    FiX,
    FiPlus,
    FiMinus,
    FiStar,
} from "react-icons/fi";
import { BsStarHalf } from "react-icons/bs";

interface Category {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

interface CategoryWithIcon extends Category {
    icon: React.ReactNode;
}

const bestSellers = [
    {
        name: "Baby Fabric Shoes",
        price: "Rp40.000",
        originalPrice: "Rp50.000",
        rating: 5,
        image: "/assets/images/products/1.jpg",
    },
    {
        name: "Men's Hoodies T-Shirt",
        price: "Rp70.000",
        originalPrice: "Rp170.000",
        rating: 4.5,
        image: "/assets/images/products/2.jpg",
    },
    {
        name: "Girls T-Shirt",
        price: "Rp30.000",
        originalPrice: "Rp50.000",
        rating: 4.5,
        image: "/assets/images/products/3.jpg",
    },
    {
        name: "Woolen Hat For Men",
        price: "Rp120.000",
        originalPrice: "Rp150.000",
        rating: 5,
        image: "/assets/images/products/4.jpg",
    },
];

export default function CategorySidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [categories, setCategories] = useState<CategoryWithIcon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                // If the base URL already includes /api/v1, don't add it again
                const apiUrl = baseUrl.endsWith('/api/v1') ? `${baseUrl}/categories` : `${baseUrl}/api/v1/categories`;
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    const categoriesWithIcons = Array.isArray(data) ?
                        data.map((cat: Category) => ({
                            ...cat,
                            icon: getCategoryIcon(cat.name)
                        })) : [];
                    setCategories(categoriesWithIcons);
                } else {
                    console.error('Failed to fetch categories:', response.status);
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

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

    // Function to get an appropriate icon based on category name
    const getCategoryIcon = (name: string) => {
        // Convert name to lowercase for comparison
        const lowerName = name.toLowerCase();

        if (lowerName.includes('clothes') || lowerName.includes('shirt') || lowerName.includes('dress')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
                </svg>
            );
        } else if (lowerName.includes('foot') || lowerName.includes('shoe') || lowerName.includes('boot')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h10v-2H5V7h14v2h2V7a2 2 0 00-2-2z" />
                </svg>
            );
        } else if (lowerName.includes('jewel') || lowerName.includes('ring') || lowerName.includes('necklace') || lowerName.includes('earring') || lowerName.includes('bracelet')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
                </svg>
            );
        } else if (lowerName.includes('perfum') || lowerName.includes('deodorant') || lowerName.includes('fragrance')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 10h-1.264A6 6 0 106 10H4.736A6 6 0 1018 10z" />
                </svg>
            );
        } else if (lowerName.includes('cosmetic') || lowerName.includes('makeup') || lowerName.includes('shampoo') || lowerName.includes('sunscreen')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
                </svg>
            );
        } else if (lowerName.includes('glass') || lowerName.includes('sunglass') || lowerName.includes('lens')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
                </svg>
            );
        } else if (lowerName.includes('bag') || lowerName.includes('purse') || lowerName.includes('wallet') || lowerName.includes('backpack')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
                </svg>
            );
        } else {
            // Default icon
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2m0 0l-2-2m2 2h4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4m-4-4l2-2m2 2l-2-2m2 2v4m-4-4v4" />
                </svg>
            );
        }
    };

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-white w-full h-full overflow-y-auto">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-bold text-black">CATEGORY</h2>
                    <button onClick={onClose} className="text-black" aria-label="Close category sidebar">
                        <FiX className="text-2xl" />
                    </button>
                </div>
                <div className="p-4 flex justify-center items-center h-full">
                    <p>Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-white w-full h-full overflow-y-auto">
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
                    <div key={cat.id} className="border-b pb-4 last:border-b-0">
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
                                    <span className="text-sm line-through text-black/50">{item.originalPrice}</span>
                                    <span className="text-sm font-bold text-green-600">{item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}