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
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import CategorySidebar from "../ui/CategorySidebar";
import CartDropdown from "../ui/CartDropdown";
import FavoriteDropdown from "../ui/FavoriteDropdown";
import CategoryDropdown from "../ui/CategoryDropdown";
import SearchModal from "../ui/SearchModal";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "../ui/LoginModal";
import RegisterModal from "../ui/RegisterModal";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoriteContext";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Custom hook to detect client-side rendering
function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isFavoriteDropdownOpen, setIsFavoriteDropdownOpen] = useState(false);
  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const isClient = useIsClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Handle login/logout functionality
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
  };

  const handleLogout = () => {
    logout();
  };

  // Handle modal switching
  const switchToRegister = () => {
    setShowLoginModal(false);
    setTimeout(() => setShowRegisterModal(true), 300); // Allow time for fade out
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setTimeout(() => setShowLoginModal(true), 300); // Allow time for fade out
  };

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
  const { getFavoritesCount } = useFavorites();

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
    // Close favorite dropdown when cart is hovered
    setIsFavoriteHovered(false);
    setIsFavoriteDropdownOpen(false);
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

  // Handle favorite hover
  const handleFavoriteMouseEnter = () => {
    setIsFavoriteHovered(true);
    // Close cart dropdown when favorite is hovered
    setIsCartHovered(false);
    setIsCartDropdownOpen(false);
    // Clear any existing timeout for other dropdowns
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleFavoriteMouseLeave = () => {
    // Set a timeout to close the favorite dropdown after 300ms
    timeoutRef.current = setTimeout(() => {
      setIsFavoriteHovered(false);
      if (!isFavoriteDropdownOpen) {
        setIsFavoriteDropdownOpen(false);
      }
    }, 300);
  };

  // Handle favorite click
  const handleFavoriteClick = (e: MouseEvent) => {
    if (isMobileView) {
      // Mobile behavior - toggle dropdown
      setIsFavoriteDropdownOpen(!isFavoriteDropdownOpen);
      if (!isFavoriteDropdownOpen) {
        setIsFavoriteHovered(true); // Keep it open when clicked
      }
      return;
    }

    // Desktop behavior - if dropdown is open, close it; if closed, navigate to favorites
    if (isFavoriteDropdownOpen) {
      setIsFavoriteDropdownOpen(false);
      setIsFavoriteHovered(false);
      return;
    }

    // If dropdown is closed, navigate to favorites page
    router.push('/favorites');
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

        {/* Main Header */}
        <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-6">
              <a href="/" className="text-black text-xl font-bold">
                PRESSA
              </a>
              <div className="hidden lg:block">
                <CategoryDropdown isVisible={true} />
              </div>
            </div>

            {/* Desktop Search Bar - Only visible on desktop - Centered properly */}
            <div className="hidden lg:block flex-1 max-w-lg mx-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }} className="flex items-center border border-black rounded-full overflow-hidden w-full">
                <span className="pl-4 text-black">
                  <FiSearch />
                </span>
                <input
                  type="search"
                  placeholder="What do you want?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 outline-none text-black search-input-black-x"
                />
              </form>
            </div>

            {/* Right side - Mobile search icon + Category + Cart icons */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Icon - Only visible on mobile */}
              <div className="lg:hidden">
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className="text-black"
                  aria-label="Open search"
                >
                  <FiSearch className="text-xl" />
                </button>
              </div>


              <div
                className="relative"
                onMouseEnter={handleFavoriteMouseEnter}
                onMouseLeave={handleFavoriteMouseLeave}
              >
                <button
                  onClick={handleFavoriteClick}
                  className="text-black relative"
                  aria-label="Wishlist"
                >
                  <FiHeart className="text-xl" />
                  {isClient && getFavoritesCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getFavoritesCount()}
                    </span>
                  )}
                </button>
                <FavoriteDropdown
                  isOpen={isFavoriteDropdownOpen || isFavoriteHovered}
                  onClose={() => {
                    setIsFavoriteDropdownOpen(false);
                    setIsFavoriteHovered(false);
                  }}
                  visible={isFavoriteHovered || isFavoriteDropdownOpen}
                />
              </div>
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
                  {isClient && getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
                <CartDropdown
                  isOpen={isCartDropdownOpen || isCartHovered}
                  onClose={() => {
                    setIsCartDropdownOpen(false);
                    setIsCartHovered(false);
                  }}
                  visible={isCartHovered || isCartDropdownOpen}
                />
              </div>

              {/* User Profile / Auth Button - Visible on desktop, in mobile menu on mobile */}
              <div className="hidden md:block ml-4 relative">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || 'User avatar'}
                          className="w-7 h-7 rounded-full object-cover mr-2"
                        />
                      ) : (
                        <FiUser className="text-xl mr-1" />
                      )}
                      <span className="hidden md:inline text-sm">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-black hover:text-red-600"
                      aria-label="Logout"
                    >
                      <FiLogOut className="text-xl" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleLoginClick}
                      className="text-white bg-black px-4 py-2 rounded-full text-sm"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button - Only visible on mobile */}
              <div className="lg:hidden ml-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-black"
                  aria-label="Open menu"
                >
                  <FiMenu className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenCategorySidebar={() => setIsCategorySidebarOpen(true)}
      />


      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={switchToLogin}
      />
      <CategorySidebar
        isOpen={isCategorySidebarOpen}
        onClose={() => setIsCategorySidebarOpen(false)}
      />
    </>
  );
}
