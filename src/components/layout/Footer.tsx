"use client";
// src/components/layout/Footer.tsx
import { FaFacebook, FaInstagram, FaTwitter, FaLock } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { Category } from '@/types/category';

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          // Limit to first 4 categories for the footer
          setCategories(Array.isArray(data) ? data.slice(0, 4) : []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories if API fails
        setCategories([
          { id: 1, name: 'New Arrivals' },
          { id: 2, name: 'Best Sellers' },
          { id: 3, name: 'Sale Items' },
          { id: 4, name: 'Featured' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="text-black pt-16 pb-12">
      <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand/Company Info */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-xl mb-4">PRESSA</h3>
            <p className="text-black/40 text-sm mb-4 max-w-md">
              Elevate your shopping experience with premium products and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-black/50 hover:text-black text-lg">
                <FaFacebook />
              </a>
              <a href="#" className="text-black/50 hover:text-black text-lg">
                <FaInstagram />
              </a>
              <a href="#" className="text-black/50 hover:text-black text-lg">
                <FaTwitter />
              </a>
            </div>

            {/* Payment Methods */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-3 max-w-sm items-center" >
                {[
                  { name: 'Visa', src: '/images/payments/visa.svg' },
                  { name: 'Mastercard', src: '/images/payments/mastercard.svg' },
                  { name: 'JCB', src: 'https://cdn.jsdelivr.net/gh/veritrans/logo@master/logo/jcb.png' },
                  { name: 'BCA', src: 'https://cdn.jsdelivr.net/gh/veritrans/logo@master/logo/bca.png' },
                  { name: 'Mandiri', src: 'https://cdn.jsdelivr.net/gh/veritrans/logo@master/logo/mandiri.png' },
                  { name: 'BNI', src: 'https://cdn.jsdelivr.net/gh/veritrans/logo@master/logo/bni.png' },
                  { name: 'BRI', src: 'https://cdn.jsdelivr.net/gh/veritrans/logo@master/logo/bri.png' },
                  { name: 'CIMB', src: '/images/payments/cimb.png' },
                  { name: 'Permata', src: '/images/payments/permata.png' },
                  { name: 'GoPay', src: '/images/payments/gopay.svg' },
                  { name: 'ShopeePay', src: 'https://cdn.jsdelivr.net/gh/veritrans/logo@master/logo/shopeepay.png' },
                  { name: 'QRIS', src: 'https://cdn.jsdelivr.net/gh/veritrans/logo@master/logo/qris.png' },
                  { name: 'Akulaku', src: '/images/payments/akulaku.png' },
                ].map((method) => (
                  <img
                    key={method.name}
                    src={method.src}
                    alt={method.name}
                    title={method.name}
                    className="h-6 w-auto object-contain saturate-0 hover:saturate-100 transition-all opacity-80 hover:opacity-100 transition-all duration-300"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-black/50">
              <li><a href="/contact" className="hover:text-black transition">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-black transition">FAQs</a></li>
              <li><a href="/shipping" className="hover:text-black transition">Shipping Policy</a></li>
              <li><a href="/returns" className="hover:text-black transition">Returns & Exchanges</a></li>
              <li><a href="/privacy" className="hover:text-black transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-black/50">
              {loading ? (
                <li>Loading categories...</li>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`/category?category=${category.name}`}
                      className="hover:text-black transition"
                    >
                      {category.name}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="/shop/products" className="hover:text-black transition">New Arrivals</a></li>
                  <li><a href="/shop/products" className="hover:text-black transition">Best Sellers</a></li>
                  <li><a href="/shop/products" className="hover:text-black transition">Sale Items</a></li>
                  <li><a href="/shop/products" className="hover:text-black transition">Featured</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <div className="flex mb-4">
            </div>
            <p className="text-black/50 text-sm">
              📞 (607) 936-8058<br />
              ✉️ support@pressa.com
            </p>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="border-t-2 border-black/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img
                src="https://cdn.jsdelivr.net/gh/veritrans/logo@master/logo/Midtrans%20Logo/midtrans_logo_black.svg"
                alt="Midtrans"
                className="h-4 w-auto object-contain ml-2 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
              />
              <FaLock className="text-green-500/60" />
              <span className="text-sm text-black/60">Secure Payment</span>
            </div>
            <p className="text-sm font-medium text-black/60">
              © 2025 - {new Date().getFullYear()} PRESSA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}