// src/components/product/Category.tsx
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
import { PRODUCT_CATEGORIES } from '@/lib/constants';

export default function Category() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  // Map category names to icons
  const categoryIcons: Record<string, any> = {
    fashion: FiShoppingBag,
    electronics: FiCpu,
    'home & living': FiHome,
    sports: FiActivity,
    books: FiBook,
    toys: FiGift,
  };

  return (
    <div className="relative w-full md:w-[90vw] lg:w-[90vw] mx-auto py-5">
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

            {PRODUCT_CATEGORIES.map((category) => {
              const IconComponent = categoryIcons[category.id] || FiPlus;
              return (
                <div
                  key={category.id}
                  className="category-card shrink-0 w-[calc(25%-12px)]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div
                    className="rounded-lg overflow-hidden border-2 border-black/10 cursor-pointer h-24 transition-all duration-300 hover:border-black/20"
                    onMouseEnter={() => setHoveredCategory(1)} // Just using a simple counter to trigger hover effect
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="flex h-full">
                      <div className="w-1/3 h-full bg-black/10 flex items-center justify-center">
                        <IconComponent className="text-3xl text-black/70" />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-black text-sm truncate">
                            {category.name}
                          </h3>
                          <span className="text-xs text-black/50 whitespace-nowrap">
                            (67)
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
            className="flex overflow-x-auto gap-4 scroll-smooth px-2"
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

            {PRODUCT_CATEGORIES.map((category) => {
              const IconComponent = categoryIcons[category.id] || FiPlus;
              return (
                <div
                  key={category.id}
                  className="category-icon flex flex-col items-center shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div
                    className="w-16 h-16 rounded-lg bg-black/10 flex items-center justify-center mb-2"
                    onMouseEnter={() => setHoveredCategory(1)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <IconComponent className="text-2xl text-black/70" />
                  </div>
                  <span className="text-xs text-black/70 text-center w-16">{category.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}