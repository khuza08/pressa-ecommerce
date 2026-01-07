'use client';

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiMenu } from 'react-icons/fi';
import CategorySidebar from './CategorySidebar'; // Import the existing CategorySidebar

type Category = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

interface CategoryDropdownProps {
  isVisible?: boolean;
}

export default function CategoryDropdown({ isVisible = true }: CategoryDropdownProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        // If the base URL already includes /api/v1, don't add it again
        const apiUrl = baseUrl.endsWith('/api/v1') ? `${baseUrl}/categories` : `${baseUrl}/api/v1/categories`;
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setCategories(Array.isArray(data) ? data : []);
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

    fetchCategories();
  }, []);

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

  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="hidden lg:block">
        <div className="flex items-center text-black">
          <span className="font-medium">Categories</span>
          <FiChevronDown className="ml-1" />
        </div>
      </div>
    );
  }

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
        className="relative hidden sm:hidden md:hidden lg:block"
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
                key={category.id}
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}