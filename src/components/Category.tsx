// src/components/Category.tsx
'use client';
import { useState, useRef, useEffect } from "react";
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
  { id: 1, name: "Fashion", items: 128, icon: FiShoppingBag },
  { id: 2, name: "Electronics", items: 86, icon: FiCpu },
  { id: 3, name: "Home & Living", items: 94, icon: FiHome },
  { id: 4, name: "Sports", items: 62, icon: FiActivity },
  { id: 5, name: "Books", items: 45, icon: FiBook },
  { id: 6, name: "Toys", items: 73, icon: FiGift },
];

export default function Category() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality for desktop/tablet view
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

          // Check if we've reached the end
          if (scrollLeft + clientWidth >= scrollWidth - 1) {
            // Reset to beginning
            carouselRef.current.scrollTo({
              left: 0,
              behavior: 'smooth'
            });
            setActiveDot(0);
          } else {
            // Scroll to next item
            const categoryCard = carouselRef.current.querySelector('.category-card') as HTMLElement;
            if (categoryCard) {
              carouselRef.current.scrollTo({
                left: scrollLeft + categoryCard.offsetWidth + 16, // 16px for gap
                behavior: 'smooth'
              });
            }
            setActiveDot((prev) => (prev + 1) % categories.length);
          }
        }
      }, 3000); // 3 seconds delay
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Desktop/Tablet View - Full Cards */}
          <div className="hidden md:block">
            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-4 pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
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
                    className="category-card shrink-0 w-full md:w-1/3 lg:w-1/4"
                  >
                    <div
                      className="rounded-lg overflow-hidden border-2 border-black/10 cursor-pointer h-24 transition-all duration-300 hover:shadow-lg hover:border-black/20"
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

          {/* Mobile View - Icons Only */}
          <div className="md:hidden">
            <div className="flex justify-between">
              {categories.slice(0, 4).map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 transition-all duration-300 hover:shadow-md"
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <IconComponent className="text-2xl text-gray-700" />
                    </div>
                    <span className="text-xs text-gray-700">{category.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}