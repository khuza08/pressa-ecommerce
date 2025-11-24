// src/components/CategoryDropdown.tsx
"use client";

interface Category {
    name: string;
    subcategories: string[];
}

const categories: Category[] = [
    {
        name: "Electronics",
        subcategories: ["Desktop", "Laptop", "Camera", "Tablet", "Headphone"],
    },
    {
        name: "Men's",
        subcategories: ["Formal", "Casual", "Sports", "Jacket", "Sunglasses"],
    },
    {
        name: "Women's",
        subcategories: ["Formal", "Casual", "Perfume", "Cosmetics", "Bags"],
    },
    {
        name: "Electronics (2)",
        subcategories: ["Smart Watch", "Smart TV", "Keyboard", "Mouse", "Microphone"],
    },
];

export default function CategoryDropdown({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 w-screen bg-white shadow-xl z-50 mt-2">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {categories.map((cat) => (
                        <div key={cat.name} className="space-y-3">
                            <h3 className="font-bold text-lg text-black">{cat.name}</h3>
                            <ul className="space-y-2">
                                {cat.subcategories.map((sub) => (
                                    <li key={sub}>
                                        <a href="#" className="text-gray-600 hover:text-black transition-colors block">
                                            {sub}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}