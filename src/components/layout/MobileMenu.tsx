"use client";

import {
  FiHome,
  FiShoppingCart,
  FiHeart,
  FiGrid,
  FiPlus,
  FiMinus,
  FiX,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoriteContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCategorySidebar?: () => void;
}

const MobileMenu = ({
  isOpen,
  onClose,
  onOpenCategorySidebar,
}: MobileMenuProps) => {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const { getFavoritesCount } = useFavorites();
  const { user, logout } = useAuth();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    onClose(); // Close the menu after logout
  };

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-[#242424]/20 backdrop-blur-sm lg:hidden h-screen"
        onClick={onClose}
      ></div>
      <div className="fixed top-0 right-0 z-50 h-full w-80 max-w-[80vw] bg-white lg:hidden overflow-y-auto border-r-2 border-black/20">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold text-black">Menu</h2>
          <button
            onClick={onClose}
            className="text-black"
            aria-label="Close menu"
          >
            <FiX className="text-2xl" />
          </button>
        </div>
        <ul className="p-4 space-y-4">
          <li>
            <a
              href="/"
              className="block py-2 font-medium text-black"
              onClick={onClose}
            >
              <div className="flex items-center">
                <FiHome className="mr-3" />
                Home
              </div>
            </a>
          </li>

          {/* User Profile / Auth Menu Items - Only visible when not logged in */}
          {!user && (
            <>
              <li>
                <button
                  className="flex justify-between items-center w-full py-2 font-medium text-black"
                  onClick={() => {
                    onClose();
                    // In a real app, you might want to open a login modal from the mobile menu
                    // For now, we'll navigate to a login page or trigger the header's login modal
                    // You can customize this behavior as needed
                  }}
                >
                  <div className="flex items-center">
                    <FiUser className="mr-3" />
                    Sign In
                  </div>
                </button>
              </li>
              <li>
                <button
                  className="flex justify-between items-center w-full py-2 font-medium text-black"
                  onClick={() => {
                    onClose();
                    // You might want to navigate to register page
                  }}
                >
                  <div className="flex items-center">
                    <FiUser className="mr-3" />
                    Sign Up
                  </div>
                </button>
              </li>
            </>
          )}

          {/* User Profile - Only visible when logged in */}
          {user && (
            <>
              <li>
                <div className="flex items-center py-2 font-medium text-black">
                  <FiUser className="mr-3" />
                  <span>Hello, {user.name}</span>
                </div>
              </li>
              <li>
                <button
                  className="flex justify-between items-center w-full py-2 font-medium text-black"
                  onClick={handleLogout}
                >
                  <div className="flex items-center">
                    <FiLogOut className="mr-3" />
                    Logout
                  </div>
                </button>
              </li>
            </>
          )}

          <li>
            <button
              className="flex justify-between items-center w-full py-2 font-medium text-black"
              onClick={() => {
                onClose();
                router.push("/shop/cart");
              }}
            >
              <div className="flex items-center">
                <FiShoppingCart className="mr-3" />
                Cart
                {getTotalItems() > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </div>
            </button>
          </li>
          <li>
            <button
              className="flex justify-between items-center w-full py-2 font-medium text-black"
              onClick={() => {
                onClose();
                router.push("/favorites");
              }}
            >
              <div className="flex items-center">
                <FiHeart className="mr-3" />
                Wishlist
                {getFavoritesCount() > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getFavoritesCount()}
                  </span>
                )}
              </div>
            </button>
          </li>
          <li>
            <button
              className="flex justify-between items-center w-full py-2 font-medium text-black"
              onClick={() => {
                onClose();
                if (onOpenCategorySidebar) {
                  onOpenCategorySidebar();
                }
              }}
            >
              <div className="flex items-center">
                <FiGrid className="mr-3" />
                Categories
              </div>
            </button>
          </li>
          <li>
            <button
              className="flex justify-between items-center w-full py-2 font-medium text-black"
              onClick={() => toggleAccordion("categories")}
            >
              <span>Shop by Category</span>
              {openAccordion === "categories" ? (
                <FiMinus className="text-lg" />
              ) : (
                <FiPlus className="text-lg" />
              )}
            </button>
            {openAccordion === "categories" && (
              <ul className="pl-4 mt-2 space-y-2 text-black">
                <li>
                  <a href="#" className="block py-1" onClick={onClose}>
                    All Products
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-1" onClick={onClose}>
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-1" onClick={onClose}>
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-1" onClick={onClose}>
                    Sale Items
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-1" onClick={onClose}>
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
              <span>Men`s</span>
              {openAccordion === "mens" ? (
                <FiMinus className="text-lg" />
              ) : (
                <FiPlus className="text-lg" />
              )}
            </button>
            {openAccordion === "mens" && (
              <ul className="pl-4 mt-2 space-y-2 text-black">
                <li>
                  <a href="#" className="block py-1" onClick={onClose}>
                    Shirt
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-1" onClick={onClose}>
                    Shorts & Jeans
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-1" onClick={onClose}>
                    Safety Shoes
                  </a>
                </li>
                <li>
                  <a href="#" className="block py-1" onClick={onClose}>
                    Wallet
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileMenu;
