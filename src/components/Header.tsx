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
  FiShoppingBag,
  FiMenu,
  FiX,
  FiPlus,
  FiMinus,
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

      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Top Bar */}
        <div className="hidden md:block bg-gray-900 text-gray-300 text-sm">
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
            <p>
              <b>Free Shipping</b> This Week Order Over - $55
            </p>
            <div className="flex space-x-2">
              <select className="bg-transparent border-none text-white text-sm">
                <option>USD $</option>
                <option>EUR €</option>
              </select>
              <select className="bg-transparent border-none text-white text-sm">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <a href="#" className="text-2xl font-bold">Anon</a>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <input
              type="search"
              placeholder="Enter your product name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button className="bg-gray-800 text-white px-4 rounded-r hover:bg-gray-700 transition">
              <FiSearch className="text-xl" />
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-black" aria-label="Account">
              <FiUser className="text-xl" />
            </button>
            <button className="text-gray-700 hover:text-black relative" aria-label="Wishlist">
              <FiHeart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button className="text-gray-700 hover:text-black relative" aria-label="Cart">
              <FiShoppingBag className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu className="text-2xl" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block bg-gray-100">
          <div className="container mx-auto px-4 py-2">
            <ul className="flex flex-wrap justify-center space-x-4 md:space-x-6">
              <li>
                <a href="#" className="font-medium hover:text-blue-600 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="font-medium hover:text-blue-600 transition">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="font-medium hover:text-blue-600 transition">
                  Men's
                </a>
              </li>
              <li>
                <a href="#" className="font-medium hover:text-blue-600 transition">
                  Women's
                </a>
              </li>
              <li>
                <a href="#" className="font-medium hover:text-blue-600 transition">
                  Jewelry
                </a>
              </li>
              <li>
                <a href="#" className="font-medium hover:text-blue-600 transition">
                  Perfume
                </a>
              </li>
              <li>
                <a href="#" className="font-medium hover:text-blue-600 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="font-medium hover:text-blue-600 transition">
                  Hot Offers
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto pb-16">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-bold">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700"
              aria-label="Close menu"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <ul className="p-4 space-y-4">
            <li>
              <a href="#" className="block py-2 font-medium">
                Home
              </a>
            </li>

            {/* Men's Accordion */}
            <li>
              <button
                className="flex justify-between items-center w-full py-2 font-medium"
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
                <ul className="pl-4 mt-2 space-y-2 text-gray-600">
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
                className="flex justify-between items-center w-full py-2 font-medium"
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
                <ul className="pl-4 mt-2 space-y-2 text-gray-600">
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
                className="flex justify-between items-center w-full py-2 font-medium"
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
                className="flex justify-between items-center w-full py-2 font-medium"
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
    </>
  );
}