'use client';

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiMenu } from 'react-icons/fi';
import CategorySidebar from './CategorySidebar'; // Import the existing CategorySidebar

type Category = {
  name: string;
  subcategories?: string[];
};

const categories: Category[] = [
  {
    name: "Men's",
    subcategories: ["Shirt", "Shorts & Jeans", "Safety Shoes", "Wallet"]
  },
  {
    name: "Women's",
    subcategories: ["Dress & Frock", "Earrings", "Necklace", "Makeup Kit"]
  },
  {
    name: "Jewelry",
    subcategories: ["Earrings", "Couple Rings", "Necklace", "Bracelets"]
  },
  {
    name: "Perfume",
    subcategories: ["Clothes Perfume", "Deodorant", "Flower Fragrance", "Air Freshener"]
  },
];

interface CategoryDropdownProps {
  isVisible?: boolean;
}

export default function CategoryDropdown({ isVisible = true }: CategoryDropdownProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (name: string) => {
    setActiveCategory(name);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Delay to allow for smoother transitions
    setTimeout(() => {
      if (!isHovered) {
        setActiveCategory(null);
      }
    }, 300);
  };

  const currentCategory = categories.find(cat => cat.name === activeCategory);
  const hasSubcategories = currentCategory?.subcategories && currentCategory.subcategories.length > 0;

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile View - Hamburger Icon */}
      <button
        className="lg:hidden text-black"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open categories menu"
      >
        <FiMenu className="text-xl" />
      </button>

      {/* Mobile Sidebar Menu using existing CategorySidebar */}
      <CategorySidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Desktop View - Dropdown */}
      <div 
        className="relative hidden lg:block" 
        ref={dropdownRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className="flex items-center text-black hover:text-black transition relative z-10"
          onMouseEnter={() => handleMouseEnter("Categories")}
          aria-expanded={!!activeCategory}
          aria-haspopup="true"
        >
          <span className="font-medium">Categories</span>
          <FiChevronDown className="ml-1" />
        </button>

        <div 
          className={`absolute top-full left-0 bg-white shadow-xl rounded-lg py-2 w-56 transition-all duration-300 z-50 ${
            activeCategory ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ul>
            {categories.map((category) => (
              <li
                key={category.name}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.name)}
              >
                <a
                  href="#"
                  className={`block px-4 py-2 text-sm ${
                    activeCategory === category.name
                      ? 'bg-black/10 text-black font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </a>
                
                {category.subcategories && category.subcategories.length > 0 && (
                  <div 
                    className={`absolute left-full top-0 bg-white shadow-xl rounded-lg py-2 w-48 transition-all duration-300 z-50 ${
                      activeCategory === category.name
                        ? 'opacity-100 visible'
                        : 'opacity-0 invisible'
                    }`}
                  >
                    <ul>
                      {category.subcategories.map((subcategory, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
                          >
                            {subcategory}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}