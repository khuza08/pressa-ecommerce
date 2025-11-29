// src/components/Header.tsx
"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiPlus,
  FiMinus,
  FiHome,
  FiGrid,
} from "react-icons/fi";
import CategorySidebar from "../ui/CategorySidebar";
import CartDropdown from "../ui/CartDropdown";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Check screen size to determine mobile/desktop behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    // Check on mount
    if (typeof window !== 'undefined') {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
    }

    // Clean up listener
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, []);

  // Use cart context to get cart items count
  const { getTotalItems } = useCart();

  const handleMouseEnter = (menu: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    // Set a timeout to close the dropdown after 300ms
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  // Handle cart hover
  const handleCartMouseEnter = () => {
    setIsCartHovered(true);
    // Clear any existing timeout for other dropdowns
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleCartMouseLeave = () => {
    // Set a timeout to close the cart dropdown after 300ms
    timeoutRef.current = setTimeout(() => {
      setIsCartHovered(false);
      if (!isCartDropdownOpen) {
        setIsCartDropdownOpen(false);
      }
    }, 300);
  };

  // Handle cart click
  const handleCartClick = (e: MouseEvent) => {
    if (isMobileView) {
      // Mobile behavior - toggle dropdown
      setIsCartDropdownOpen(!isCartDropdownOpen);
      if (!isCartDropdownOpen) {
        setIsCartHovered(true); // Keep it open when clicked
      }
      return;
    }

    // Desktop behavior - if dropdown is open, close it; if closed, navigate to cart
    if (isCartDropdownOpen) {
      setIsCartDropdownOpen(false);
      setIsCartHovered(false);
      return;
    }

    // If dropdown is closed, navigate to cart page
    router.push('/shop/cart');
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const socialIcons = [
    { icon: <FiFacebook />, href: "#" },
    { icon: <FiTwitter />, href: "#" },
    { icon: <FiInstagram />, href: "#" },
    { icon: <FiLinkedin />, href: "#" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        {/* Top Bar */}
        <div className="hidden md:block text-black text-sm">
          <div className="container mx-auto flex justify-between items-center py-2 px-4">
            <div className="flex space-x-4">
              {socialIcons.map((item, idx) => (
                <a key={idx} href={item.href} aria-label="Social link">
                  {item.icon}
                </a>
              ))}
            </div>
            <p className="text-black">
              <b>Free Shipping</b> This Week Order Over - $55
            </p>
            <div className="flex space-x-2">
              <select className="bg-transparent border-none text-black text-sm">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="text-black text-xl font-bold">
              PRESSA
            </a>
            <div className="flex-1 max-w-lg relative">
              <div className="flex items-center border border-black rounded-full overflow-hidden">
                <span className="pl-4 text-black">
                  <FiSearch />
                </span>
                <input
                  type="search"
                  placeholder="What do you want?"
                  className="w-full px-3 py-2 outline-none text-black search-input-black-x"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-black relative" aria-label="Wishlist">
                <FiHeart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  67
                </span>
              </button>
              <div
                className="relative"
                onMouseEnter={handleCartMouseEnter}
                onMouseLeave={handleCartMouseLeave}
              >
                <button
                  ref={cartButtonRef}
                  onClick={handleCartClick}
                  className="text-black relative"
                  aria-label="Cart"
                >
                  <FiShoppingCart className="text-xl" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
                <CartDropdown
                  isOpen={isCartDropdownOpen || isCartHovered}
                  onClose={() => setIsCartDropdownOpen(false)}
                  visible={isCartHovered || isCartDropdownOpen}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block relative">
          <div className="container mx-auto px-4 py-2">
            <ul className="flex flex-wrap justify-center space-x-4 md:space-x-6">
              <li>
                <a href="#" className="font-medium text-black hover:text-black transition">
                  Home
                </a>
              </li>
              <li 
                className="relative"
                onMouseEnter={() => handleMouseEnter("categories")}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#" className="font-medium text-black hover:text-black transition">
                  Categories
                </a>
                <ul 
                  className={`absolute top-full left-0 bg-white shadow-xl rounded mt-2 py-2 w-48 transition-all duration-300 ${
                    activeDropdown === "categories" 
                      ? "opacity-100 visible" 
                      : "opacity-0 invisible"
                  }`}
                  onMouseEnter={() => handleMouseEnter("categories")}
                  onMouseLeave={handleMouseLeave}
                >
                  {["All Products", "New Arrivals", "Best Sellers", "Sale Items", "Trending"].map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li 
                className="relative"
                onMouseEnter={() => handleMouseEnter("mens")}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#" className="font-medium text-black hover:text-black transition">
                  Men's
                </a>
                <ul 
                  className={`absolute top-full left-0 bg-white shadow-xl rounded mt-2 py-2 w-48 transition-all duration-300 ${
                    activeDropdown === "mens" 
                      ? "opacity-100 visible" 
                      : "opacity-0 invisible"
                  }`}
                  onMouseEnter={() => handleMouseEnter("mens")}
                  onMouseLeave={handleMouseLeave}
                >
                  {["Shirt", "Shorts & Jeans", "Safety Shoes", "Wallet"].map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li 
                className="relative"
                onMouseEnter={() => handleMouseEnter("womens")}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#" className="font-medium text-black hover:text-black transition">
                  Women's
                </a>
                <ul 
                  className={`absolute top-full left-0 bg-white shadow-xl rounded mt-2 py-2 w-48 transition-all duration-300 ${
                    activeDropdown === "womens" 
                      ? "opacity-100 visible" 
                      : "opacity-0 invisible"
                  }`}
                  onMouseEnter={() => handleMouseEnter("womens")}
                  onMouseLeave={handleMouseLeave}
                >
                  {["Dress & Frock", "Earrings", "Necklace", "Makeup Kit"].map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li 
                className="relative"
                onMouseEnter={() => handleMouseEnter("jewelry")}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#" className="font-medium text-black hover:text-black transition">
                  Jewelry
                </a>
                <ul 
                  className={`absolute top-full left-0 bg-white shadow-xl rounded mt-2 py-2 w-48 transition-all duration-300 ${
                    activeDropdown === "jewelry" 
                      ? "opacity-100 visible" 
                      : "opacity-0 invisible"
                  }`}
                  onMouseEnter={() => handleMouseEnter("jewelry")}
                  onMouseLeave={handleMouseLeave}
                >
                  {["Earrings", "Couple Rings", "Necklace", "Bracelets"].map((item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li 
                className="relative"
                onMouseEnter={() => handleMouseEnter("perfume")}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#" className="font-medium text-black hover:text-black transition">
                  Perfume
                </a>
                <ul 
                  className={`absolute top-full left-0 bg-white shadow-xl rounded mt-2 py-2 w-48 transition-all duration-300 ${
                    activeDropdown === "perfume" 
                      ? "opacity-100 visible" 
                      : "opacity-0 invisible"
                  }`}
                  onMouseEnter={() => handleMouseEnter("perfume")}
                  onMouseLeave={handleMouseLeave}
                >
                  {["Clothes Perfume", "Deodorant", "Flower Fragrance", "Air Freshener"].map(
                    (item, i) => (
                      <li key={i}>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </li>
              <li>
                <a href="#" className="font-medium text-black hover:text-black transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="font-medium text-black hover:text-black transition">
                  Hot Offers
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
            style={{ height: "calc(100vh - 4rem)" }}
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 z-50 h-full w-80 max-w-[80vw] bg-white shadow-xl lg:hidden overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-bold text-black">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-black"
                aria-label="Close menu"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            <ul className="p-4 space-y-4">
              <li>
                <a href="#" className="block py-2 font-medium text-black">
                  Home
                </a>
              </li>
              <li>
                <button
                  className="flex justify-between items-center w-full py-2 font-medium text-black"
                  onClick={() => toggleAccordion("categories")}
                >
                  <span>Categories</span>
                  {openAccordion === "categories" ? (
                    <FiMinus className="text-lg" />
                  ) : (
                    <FiPlus className="text-lg" />
                  )}
                </button>
                {openAccordion === "categories" && (
                  <ul className="pl-4 mt-2 space-y-2 text-black">
                    <li>
                      <a href="#" className="block py-1">
                        All Products
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block py-1">
                        New Arrivals
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block py-1">
                        Best Sellers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block py-1">
                        Sale Items
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block py-1">
                        Trending
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  className="flex justify-between items-center w-full py-2 font-medium text-black"
                  onClick={() => toggleAccordion("mens")}
                >
                  <span>Men's</span>
                  {openAccordion === "mens" ? (
                    <FiMinus className="text-lg" />
                  ) : (
                    <FiPlus className="text-lg" />
                  )}
                </button>
                {openAccordion === "mens" && (
                  <ul className="pl-4 mt-2 space-y-2 text-black">
                    <li>
                      <a href="#" className="block py-1">
                        Shirt
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block py-1">
                        Shorts & Jeans
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block py-1">
                        Safety Shoes
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block py-1">
                        Wallet
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/20 shadow-xl">
        <div className="flex justify-around items-center py-2 px-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center p-2"
            aria-label="Menu"
          >
            <FiMenu className="text-xl text-black" />
            <span className="text-xs mt-1 text-black">Menu</span>
          </button>
          <button
            onClick={handleCartClick}
            className="flex flex-col items-center p-2 relative"
            aria-label="Cart"
          >
            <FiShoppingCart className="text-xl text-black" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
            <span className="text-xs mt-1 text-black">Cart</span>
          </button>
          <a href="#" className="flex flex-col items-center p-2" aria-label="Home">
            <FiHome className="text-xl text-black" />
            <span className="text-xs mt-1 text-black">Home</span>
          </a>
          <button className="flex flex-col items-center p-2 relative" aria-label="Wishlist">
            <FiHeart className="text-xl text-black" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              67
            </span>
            <span className="text-xs mt-1 text-black">Wishlist</span>
          </button>
          <button
            onClick={() => setIsCategorySidebarOpen(true)}
            className="flex flex-col items-center p-2"
            aria-label="Categories"
          >
            <FiGrid className="text-xl text-black" />
            <span className="text-xs mt-1 text-black">Category</span>
          </button>
        </div>
      </div>

      <CategorySidebar
        isOpen={isCategorySidebarOpen}
        onClose={() => setIsCategorySidebarOpen(false)}
      />
    </>
  );
}
