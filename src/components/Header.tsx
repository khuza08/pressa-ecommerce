// src/components/Header.tsx
"use client";

import { useState } from "react";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiPlus,
  FiMinus,
  FiHome,
  FiGrid,
} from "react-icons/fi";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  // Social icons mapping
  const socialIcons = [
    { icon: <FiFacebook />, href: "#" },
    { icon: <FiTwitter />, href: "#" },
    { icon: <FiInstagram />, href: "#" },
    { icon: <FiLinkedin />, href: "#" },
  ];

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <header className="sticky top-0 z-50 bg-white">
        {/* Top Bar */}
        <div className="hidden md:block text-white/80 text-sm">
          <div className="container mx-auto flex justify-between items-center py-2 px-4">
            <div className="flex space-x-4">
              {socialIcons.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="hover:text-white transition"
                  aria-label="Social link"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <p className="text-black">
              <b>Free Shipping</b> This Week Order Over - $55
            </p>
            <div className="flex space-x-2">
              <select className="bg-transparent border-none text-black text-sm">
                <option>USD $</option>
                <option>EUR €</option>
              </select>
              <select className="bg-transparent border-none text-black text-sm">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Header — Search Bar + Icons */}
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="#" className="text-black text-xl font-bold">
              PRESSA
            </a>

            {/* Search Bar (Centered) */}
            <div className="flex-1 max-w-lg relative">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <span className="pl-4 text-gray-600">
                  <FiSearch />
                </span>
                <input
                  type="search"
                  placeholder="Search any....."
                  className="w-full px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Heart & Cart Icons (Right Side) */}
            <div className="flex items-center space-x-4">
              <button className="text-black relative" aria-label="Wishlist">
                <FiHeart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  67
                </span>
              </button>
              <button className="text-black relative" aria-label="Cart">
                <FiShoppingCart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  67
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <div className="container mx-auto px-4 py-2">
            <ul className="flex flex-wrap justify-center space-x-4 md:space-x-6">
              <li>
                <a href="#" className="font-medium text-black/70 hover:text-black transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="font-medium text-black/70 hover:text-black transition">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="font-medium text-black/70 hover:text-black transition">
                  Men's
                </a>
              </li>
              <li>
                <a href="#" className="font-medium text-black/70 hover:text-black transition">
                  Women's
                </a>
              </li>
              <li>
                <a href="#" className="font-medium text-black/70 hover:text-black transition">
                  Jewelry
                </a>
              </li>
              <li>
                <a href="#" className="font-medium text-black/70 hover:text-black transition">
                  Perfume
                </a>
              </li>
              <li>
                <a href="#" className="font-medium text-black/70 hover:text-black transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="font-medium text-black/70 hover:text-black transition">
                  Hot Offers
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu (Sidebar) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto pb-16">
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

            {/* Men's Accordion */}
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

            {/* Women's Accordion */}
            <li>
              <button
                className="flex justify-between items-center w-full py-2 font-medium text-black"
                onClick={() => toggleAccordion("womens")}
              >
                <span>Women's</span>
                {openAccordion === "womens" ? (
                  <FiMinus className="text-lg" />
                ) : (
                  <FiPlus className="text-lg" />
                )}
              </button>
              {openAccordion === "womens" && (
                <ul className="pl-4 mt-2 space-y-2 text-black">
                  <li>
                    <a href="#" className="block py-1">
                      Dress & Frock
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1">
                      Earrings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1">
                      Necklace
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1">
                      Makeup Kit
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Jewelry Accordion */}
            <li>
              <button
                className="flex justify-between items-center w-full py-2 font-medium text-black"
                onClick={() => toggleAccordion("jewelry")}
              >
                <span>Jewelry</span>
                {openAccordion === "jewelry" ? (
                  <FiMinus className="text-lg" />
                ) : (
                  <FiPlus className="text-lg" />
                )}
              </button>
              {openAccordion === "jewelry" && (
                <ul className="pl-4 mt-2 space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="block py-1">
                      Earrings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1">
                      Couple Rings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1">
                      Necklace
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1">
                      Bracelets
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Perfume Accordion */}
            <li>
              <button
                className="flex justify-between items-center w-full py-2 font-medium text-black"
                onClick={() => toggleAccordion("perfume")}
              >
                <span>Perfume</span>
                {openAccordion === "perfume" ? (
                  <FiMinus className="text-lg" />
                ) : (
                  <FiPlus className="text-lg" />
                )}
              </button>
              {openAccordion === "perfume" && (
                <ul className="pl-4 mt-2 space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="block py-1">
                      Clothes Perfume
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1">
                      Deodorant
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1">
                      Flower Fragrance
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block py-1">
                      Air Freshener
                    </a>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <a href="#" className="block py-2 font-medium">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 font-medium">
                Hot Offers
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center py-2 px-4">
          {/* Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center p-2"
            aria-label="Menu"
          >
            <FiMenu className="text-xl text-gray-700" />
            <span className="text-xs mt-1 text-gray-700">Menu</span>
          </button>

          {/* Cart */}
          <button className="flex flex-col items-center p-2 relative" aria-label="Cart">
            <FiShoppingCart className="text-xl text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              67
            </span>
            <span className="text-xs mt-1 text-gray-700">Cart</span>
          </button>

          {/* Home */}
          <a href="#" className="flex flex-col items-center p-2" aria-label="Home">
            <FiHome className="text-xl text-gray-700" />
            <span className="text-xs mt-1 text-gray-700">Home</span>
          </a>

          {/* Wishlist */}
          <button className="flex flex-col items-center p-2 relative" aria-label="Wishlist">
            <FiHeart className="text-xl text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              67
            </span>
            <span className="text-xs mt-1 text-gray-700">Wishlist</span>
          </button>

          {/* Categories / Grid */}
          <button className="flex flex-col items-center p-2" aria-label="Categories">
            <FiGrid className="text-xl text-gray-700" />
            <span className="text-xs mt-1 text-gray-700">Category</span>
          </button>
        </div>
      </div>
    </>
  );
}