// src/components/Header.tsx
"use client";

import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

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
              {["logo-facebook", "logo-twitter", "logo-instagram", "logo-linkedin"].map((icon) => (
                <a key={icon} href="#" className="hover:text-white transition">
                  <ion-icon name={icon}></ion-icon>
                </a>
              ))}
            </div>
            <p><b>Free Shipping</b> This Week Order Over - $55</p>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none"
            />
            <button className="bg-gray-800 text-white px-4 rounded-r">
              <ion-icon name="search-outline"></ion-icon>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-black">
              <ion-icon name="person-outline" className="text-xl"></ion-icon>
            </button>
            <button className="text-gray-700 hover:text-black relative">
              <ion-icon name="heart-outline" className="text-xl"></ion-icon>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </button>
            <button className="text-gray-700 hover:text-black relative">
              <ion-icon name="bag-handle-outline" className="text-xl"></ion-icon>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <ion-icon name="menu-outline" className="text-2xl"></ion-icon>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block bg-gray-100">
          <div className="container mx-auto px-4 py-2">
            <ul className="flex space-x-6">
              <li><a href="#" className="font-medium hover:text-blue-600">Home</a></li>
              <li className="group relative">
                <a href="#" className="font-medium hover:text-blue-600">Categories</a>
                {/* Dropdown panel: tambahkan jika perlu */}
              </li>
              <li><a href="#" className="font-medium hover:text-blue-600">Men's</a></li>
              <li><a href="#" className="font-medium hover:text-blue-600">Women's</a></li>
              <li><a href="#" className="font-medium hover:text-blue-600">Jewelry</a></li>
              <li><a href="#" className="font-medium hover:text-blue-600">Perfume</a></li>
              <li><a href="#" className="font-medium hover:text-blue-600">Blog</a></li>
              <li><a href="#" className="font-medium hover:text-blue-600">Hot Offers</a></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto pb-16">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-bold">Menu</h2>
            <button onClick={() => setMobileMenuOpen(false)}>
              <ion-icon name="close-outline" className="text-2xl"></ion-icon>
            </button>
          </div>
        

          <ul className="p-4 space-y-4">
            <li><a href="#" className="block py-2 font-medium">Home</a></li>

            {/* Accordion Example - Men's */}
            <li>
              <button
                className="flex justify-between items-center w-full py-2 font-medium"
                onClick={() => toggleAccordion("mens")}
              >
                <span>Men's</span>
                <ion-icon
                  name={openAccordion === "mens" ? "remove-outline" : "add-outline"}
                ></ion-icon>
              </button>
              {openAccordion === "mens" && (
                <ul className="pl-4 mt-2 space-y-2 text-gray-600">
                  <li><a href="#">Shirt</a></li>
                  <li><a href="#">Shorts & Jeans</a></li>
                  <li><a href="#">Safety Shoes</a></li>
                  <li><a href="#">Wallet</a></li>
                </ul>
              )}
            </li>

            {/* Ulangi untuk Women's, Jewelry, Perfume, dll */}
          </ul>
        </div>
      )}
    </>
  );
}