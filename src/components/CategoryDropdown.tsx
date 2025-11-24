// src/components/CategoryDropdown.tsx
"use client";

interface Category {
    name: string;
    subcategories: string[];
    banner?: string; // Optional banner image
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

export default function CategoryDropdown({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose?: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-xl z-50 mt-2 min-w-[80vw] max-w-6xl w-full">
            <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {categories.map((cat) => (
                        <div key={cat.name} className="space-y-3">
                            <h3 className="font-bold text-lg text-black border-b pb-2">{cat.name}</h3>
                            <ul className="space-y-2">
                                {cat.subcategories.map((sub) => (
                                    <li key={sub}>
                                        <a href="#" className="text-gray-600 hover:text-black transition-colors block text-sm">
                                            {sub}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            {cat.banner && (
                                <a href="#" className="block mt-4 rounded-md overflow-hidden">
                                    <img
                                        src={cat.banner}
                                        alt={`${cat.name} banner`}
                                        className="w-full h-auto object-cover"
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