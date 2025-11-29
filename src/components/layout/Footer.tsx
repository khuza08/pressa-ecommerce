// src/components/layout/Footer.tsx
import { FaFacebook, FaInstagram, FaTwitter, FaCcVisa, FaCcMastercard, FaCcPaypal, FaLock } from "react-icons/fa";

export default function Footer() {
  return (
<footer className="text-black pt-16 pb-12">
        <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand/Company Info */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-xl mb-4">PRESSA</h3>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
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
              <li><a href="/shop/products" className="hover:text-black transition">New Arrivals</a></li>
              <li><a href="/shop/products" className="hover:text-black transition">Best Sellers</a></li>
              <li><a href="/shop/products" className="hover:text-black transition">Sale Items</a></li>
              <li><a href="/shop/products" className="hover:text-black transition">Featured</a></li>
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
        <div className="border-t border-black/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-2 mb-4 md:mb-0">
              <FaCcVisa className="text-2xl text-black" />
              <FaCcMastercard className="text-2xl text-black" />
              <FaCcPaypal className="text-2xl text-black" />
            </div>
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FaLock className="text-green-500" />
              <span className="text-xs text-black">Secure Payment</span>
            </div>
            <p className="text-sm text-black">
              Copyright © {new Date().getFullYear()} PRESSA. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}