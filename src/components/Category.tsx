// src/components/Category.tsx
'use client';
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const categories = [
  { 
    id: 1, 
    name: "Fashion", 
    items: 128,
    image: "https://picsum.photos/seed/fashion/400/200.jpg"
  },
  { 
    id: 2, 
    name: "Electronics", 
    items: 86,
    image: "https://picsum.photos/seed/electronics/400/200.jpg"
  },
  { 
    id: 3, 
    name: "Home & Living", 
    items: 94,
    image: "https://picsum.photos/seed/home/400/200.jpg"
  },
  { 
    id: 4, 
    name: "Sports", 
    items: 62,
    image: "https://picsum.photos/seed/sports/400/200.jpg"
  },
  { 
    id: 5, 
    name: "Books", 
    items: 45,
    image: "https://picsum.photos/seed/books/400/200.jpg"
  },
  { 
    id: 6, 
    name: "Toys", 
    items: 73,
    image: "https://picsum.photos/seed/toys/400/200.jpg"
  },
];

export default function Category() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                hoveredCategory === category.id ? "transform -translate-y-1" : ""
              }`}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Container landscape lebih kecil */}
              <div className="flex h-24">
                
                {/* KOLOM KIRI: Gambar */}
                <div className="w-1/3 h-full flex-shrink-0">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* KOLOM KANAN: Konten teks */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  
                  {/* Nama kategori dengan quantity di sebelah kanan */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{category.name}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{category.items}</span>
                  </div>

                  {/* Tombol Show All */}
                  <button className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition font-medium">
                    Show All
                    <FiPlus className="ml-1 w-3 h-3" />
                  </button>
              
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}