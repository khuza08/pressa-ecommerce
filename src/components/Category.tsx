// src/components/Category.tsx
'use client';
import { useState } from "react";
import {
  FiPlus,
  FiShoppingBag,
  FiCpu,
  FiHome,
  FiActivity,
  FiBook,
  FiGift
} from "react-icons/fi";

const categories = [
  { id: 1, name: "Fashion", items: 67, icon: FiShoppingBag },
  { id: 2, name: "Electronics", items: 67, icon: FiCpu },
  { id: 3, name: "Home & Living", items: 67, icon: FiHome },
  { id: 4, name: "Sports", items: 67, icon: FiActivity },
  { id: 5, name: "Books", items: 67, icon: FiBook },
  { id: 6, name: "Toys", items: 67, icon: FiGift },
];

export default function Category() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <div className="relative w-[80vw] mx-auto px-6 py-5">
      <div className="relative overflow-hidden">
        {/* Desktop/Tablet View - Full Cards */}
        <div className="hidden md:block">
          <div
            className="flex overflow-x-auto gap-4 pb-4 scroll-smooth"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="category-card shrink-0 w-[calc(25%-12px)]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div
                    className="rounded-lg overflow-hidden border-2 border-black/10 cursor-pointer h-24 transition-all duration-300 hover:border-black/20"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="flex h-full">
                      <div className="w-1/3 h-full bg-gray-100 flex items-center justify-center">
                        <IconComponent className="text-3xl text-gray-700" />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">
                            {category.name}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            ({category.items})
                          </span>
                        </div>
                        <button className="flex items-center text-xs text-black/70 hover:text-black transition font-medium">
                          Show All
                          <FiPlus className="ml-1 w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View - Scrollable Icons */}
        <div className="md:hidden">
          <div 
            className="flex overflow-x-auto gap-6 scroll-smooth"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {/* Render semua kategori, bukan hanya 4 */}
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="category-icon flex flex-col items-center shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div
                    className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-2"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <IconComponent className="text-2xl text-gray-700" />
                  </div>
                  <span className="text-xs text-gray-700 text-center w-16">{category.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}