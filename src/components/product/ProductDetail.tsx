'use client';
import { useEffect, useRef, useState, useCallback } from "react";
import {
    FaStar,
    FaHeart,
    FaShareAlt,
    FaCommentAlt,
    FaChevronRight,
    FaChevronLeft,
    FaTimes,
    FaExpand,
    FaSearchPlus,
} from "react-icons/fa";
import { productService, type Product } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoriteContext';
import { useAuth } from '@/context/AuthContext';
import { useLoginModal } from '@/context/LoginModalContext';
import ProductDetailBottomBar from './ProductDetailBottomBar';
import Image from 'next/image';

import { memo } from 'react';

const ProductDetail = memo(({ productId }: { productId: string }) => {
    const thumbnailRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState("");
    const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { openLoginModal } = useLoginModal();

    // Update tombol berdasarkan scroll position
    const updateScrollButtons = () => {
        if (!thumbnailRef.current) return;
    };

    useEffect(() => {
        const ref = thumbnailRef.current;
        if (!ref) return;

        const handleScroll = () => {
            // Update any scroll-dependent logic here if needed
        };

        ref.addEventListener("scroll", handleScroll);

        return () => {
            ref.removeEventListener("scroll", handleScroll);
        };
    }, []);


    // Update posisi zoom saat hover (for desktop only)
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x, y });
        setLensPosition({
            x: e.clientX - left - 50, // 50px = setengah dari lebar lensa
            y: e.clientY - top - 50  // 50px = setengah dari tinggi lensa
        });
    };

    // Custom hook to detect screen size
    const useMediaQuery = (query: string) => {
        const [matches, setMatches] = useState(false);

        useEffect(() => {
            const media = window.matchMedia(query);
            if (media.matches !== matches) {
                setMatches(media.matches);
            }
            const listener = () => setMatches(media.matches);
            media.addEventListener('change', listener);
            return () => media.removeEventListener('change', listener);
        }, [matches, query]);

        return matches;
    };

    // Disable scroll only when hovering on product image on desktop (for zoom effect) while keeping zoom functionality
    const isDesktop = useMediaQuery('(min-width: 768px)'); // md breakpoint and above

    useEffect(() => {
        if (isDesktop && isHovering && !isFullscreenZoom) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isDesktop, isHovering, isFullscreenZoom]);

    // Prevent wheel scroll when hover magnifier is active on desktop
    useEffect(() => {
        const preventDefault = (e: WheelEvent) => {
            if (isDesktop && isHovering && !isFullscreenZoom) {
                e.preventDefault();
            }
        };

        if (isDesktop && isHovering && !isFullscreenZoom) {
            window.addEventListener('wheel', preventDefault, { passive: false });
        }

        return () => {
            window.removeEventListener('wheel', preventDefault);
        };
    }, [isDesktop, isHovering, isFullscreenZoom]);

    // Handler untuk fullscreen zoom
    const handleFullscreenZoom = (imageUrl: string) => {
        setFullscreenImage(imageUrl);
        setIsFullscreenZoom(true);
        document.body.style.overflow = "hidden"; // Mencegah scroll saat fullscreen
    };

    // Menutup fullscreen zoom
    const closeFullscreenZoom = () => {
        setIsFullscreenZoom(false);
        document.body.style.overflow = "auto";
    };

    // Handle keyboard escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isFullscreenZoom) {
                closeFullscreenZoom();
            }
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isFullscreenZoom]);

    // Prevent scrolling when magnifier is active
    useEffect(() => {
        if (isFullscreenZoom) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isFullscreenZoom]);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Track state for when elements should become fixed at header bottom
    const [snapToHeader, setSnapToHeader] = useState({
        productImages: true, // Start in snapped position
        purchaseCard: true  // Start in snapped position
    });

    // Simple scroll detection to update snap state when scrolling
    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (!header) return;

            const headerHeight = header.clientHeight;

            // Check if product images container should snap to header
            const productImagesContainer = document.querySelector('.product-images-container');
            if (productImagesContainer) {
                const imgRect = productImagesContainer.getBoundingClientRect();
                const shouldSnapProductImages = imgRect.top <= headerHeight + 10;

                setSnapToHeader(prev => ({
                    ...prev,
                    productImages: shouldSnapProductImages
                }));
            }

            // Check if purchase card container should snap to header
            const purchaseCardContainer = document.querySelector('.purchase-card-container');
            if (purchaseCardContainer) {
                const cardRect = purchaseCardContainer.getBoundingClientRect();
                const shouldSnapPurchaseCard = cardRect.top <= headerHeight + 10;

                setSnapToHeader(prev => ({
                    ...prev,
                    purchaseCard: shouldSnapPurchaseCard
                }));
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productData = await productService.getProductById(productId);
                if (productData) {
                    setProduct(productData);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    // Initialize state based on product data when available
    const [quantity, setQuantity] = useState(1);
    const [activeVariant, setActiveVariant] = useState<string>('');
    const [activeTab, setActiveTab] = useState("detail");
    const [mainImage, setMainImage] = useState<string>("");
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { addToFavorites, removeFromFavorites, isFavorite: checkIsFavorite, favorites } = useFavorites();

    // Touch handling for mobile swipe
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd || !product) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            const images = product.images && product.images.length > 0
                ? product.images
                : product.image ? [{url: product.image, alt: product.name}] : [];

            const currentIndex = images.findIndex(img => img.url === mainImage);

            if (isLeftSwipe && currentIndex < images.length - 1) {
                // Swipe left - go to next image
                setMainImage(images[currentIndex + 1].url);
            } else if (isRightSwipe && currentIndex > 0) {
                // Swipe right - go to previous image
                setMainImage(images[currentIndex - 1].url);
            }
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    // Set initial values when product loads
    useEffect(() => {
        if (product) {
            // Set initial variant if available
            if (product.variants && product.variants.length > 0) {
                setActiveVariant(product.variants[0].id);
            }

            // Set initial main image if available
            if (product.images && product.images.length > 0 && product.images[0].url) {
                setMainImage(product.images[0].url);
            } else if (product.image) {
                setMainImage(product.image.includes('uploads')
                  ? (() => {
                      // Extract just the filename from the uploads path
                      let filename = product.image;
                      if (product.image.includes('uploads/')) {
                        filename = product.image.split('uploads/').pop() || product.image;
                      }

                      // Get the base URL and remove any /api/v1 suffix for static files
                      let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                      if (baseUrl.endsWith('/api/v1')) {
                        baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                      }

                      return `${baseUrl}/uploads/${filename}`;
                    })()
                  : product.image);
            } else {
                setMainImage("https://placehold.co/600x600?text=Product+Image");
            }

        }
    }, [product, favorites, checkIsFavorite]);

    const handleQuantityChange = (type: "increment" | "decrement") => {
        if (!product) return;

        // Determine the max stock based on whether the product has variants
        const maxStock = product?.has_variants && product?.variants
            ? (product.variants.find(v => v.id === activeVariant)?.stock || 1)
            : (product?.stock || 1);

        if (type === "increment" && quantity < maxStock) {
            setQuantity(quantity + 1);
        } else if (type === "decrement" && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const formatPrice = (price: number) => {
        return `Rp${price.toLocaleString("id-ID")}`;
    };

    if (loading) {
        return (
            <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto mb-10 flex justify-center items-center h-64">
                <p className="text-lg">Loading product...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto mb-10">
                <p className="text-lg text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto mb-10">
                <p className="text-lg">Product not found</p>
            </div>
        );
    }

    return (
        <>
            {/* Changed max-width to responsive width */}
            <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto mb-20 md:mb-10">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left Column - Product Images */}
                    <div className="product-images-container w-full md:w-[280px] relative">
                        <div
                            className="bg-white overflow-hidden sticky flex flex-col border border-black/20 rounded-lg h-[400px]"
                            style={snapToHeader.productImages ? { top: '70px' } : { top: '150px' }}
                        >
                            {/* Main Image with Zoom */}
                            {/* Mobile & Tablet: Image Carousel with Swipe */}
                            <div className="block md:hidden relative overflow-hidden w-full">
                                <div
                                    className="relative aspect-square w-full"
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {(product?.images && product?.images?.length > 0 ? product.images : product?.image ? [{url: product.image, alt: product.name}] : []).map((img, index) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${mainImage === img.url ? 'opacity-100' : 'opacity-0'}`}
                                        >
                                            {img.url?.includes('uploads') ? (
                                                <img
                                                    src={(() => {
                                                        // Extract just the filename from the uploads path
                                                        let filename = img.url;
                                                        if (img.url?.includes('uploads/')) {
                                                          filename = img.url.split('uploads/').pop() || img.url;
                                                        }

                                                        // Get the base URL and remove any /api/v1 suffix for static files
                                                        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                                        if (baseUrl.endsWith('/api/v1')) {
                                                          baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                                        }

                                                        // Use a relative URL that will be proxied to the backend
                                                        return `${baseUrl}/uploads/${filename}`;
                                                    })()}
                                                    alt={img.alt || product?.name || "Product image"}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Image
                                                    src={img.url || "https://placehold.co/600x600?text=Product+Image"}
                                                    alt={img.alt || product?.name || "Product image"}
                                                    fill
                                                    className="w-full h-full object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                    priority={false}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Carousel Indicators */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                                    {(product?.images && product?.images?.length > 0 ? product.images : product?.image ? [{url: product.image, alt: product.name}] : []).map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setMainImage(img.url)}
                                            className={`w-2 h-2 rounded-full ${mainImage === img.url ? 'bg-white' : 'bg-white/50'}`}
                                            aria-label={`View image ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Desktop: Single Image with Zoom */}
                            <div
                                className="hidden md:block w-full aspect-square relative overflow-hidden"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <div className="relative w-full h-full">
                                    {(mainImage || product?.image)?.includes('uploads') ? (
                                        <img
                                            src={(() => {
                                                const imageToUse = mainImage || product?.image;
                                                // Extract just the filename from the uploads path
                                                let filename = imageToUse;
                                                if (imageToUse?.includes('uploads/')) {
                                                  filename = imageToUse.split('uploads/').pop() || imageToUse;
                                                }

                                                // Get the base URL and remove any /api/v1 suffix for static files
                                                let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                                if (baseUrl.endsWith('/api/v1')) {
                                                  baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                                }

                                                // Use a relative URL that will be proxied to the backend
                                                return `${baseUrl}/uploads/${filename}`;
                                            })()}
                                            alt={product?.name || "Product image"}
                                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 ${isHovering ? "" : ""}`}
                                        />
                                    ) : (
                                        <Image
                                            src={mainImage || product?.image || "https://placehold.co/600x600?text=Product+Image"}
                                            alt={product?.name || "Product image"}
                                            fill
                                            className={`object-cover transition-all duration-200 ${isHovering ? "blur-sm" : ""}`}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            priority={false}
                                        />
                                    )}
                                </div>

                                {/* Fullscreen Zoom Button - Desktop only */}
                                <button
                                    onClick={() => handleFullscreenZoom(mainImage)}
                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
                                    aria-label="Zoom image"
                                >
                                    <FaExpand className="text-black/80" />
                                </button>
                            </div>

                            {/* Thumbnail Container */}
                            {/* Thumbnail Container - Hidden on mobile */}
                            <div className="hidden md:block relative p-2">
                                <div
                                    ref={thumbnailRef}
                                    className="flex gap-2 overflow-x-auto scrollbar-hide"
                                    style={{
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                        WebkitOverflowScrolling: "touch",
                                    }}
                                >
                                    {/* Show main image if no additional images */}
                                    {(product?.images && product?.images?.length > 0 ? product.images : product?.image ? [{url: product.image, alt: product.name}] : []).map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setMainImage(img.url)}
                                            className={`shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${mainImage === img.url
                                                ? "border-black/50"
                                                : "border-black/20"
                                                }`}
                                        >
                                            <div className="relative w-full h-full">
                                                {img.url?.includes('uploads') ? (
                                                    <img
                                                        src={(() => {
                                                            // Extract just the filename from the uploads path
                                                            let filename = img.url;
                                                            if (img.url?.includes('uploads/')) {
                                                              filename = img.url.split('uploads/').pop() || img.url;
                                                            }

                                                            // Get the base URL and remove any /api/v1 suffix for static files
                                                            let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                                            if (baseUrl.endsWith('/api/v1')) {
                                                              baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                                            }

                                                            // Use a relative URL that will be proxied to the backend
                                                            return `${baseUrl}/uploads/${filename}`;
                                                        })()}
                                                        alt={img.alt || "Thumbnail"}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={img.url || "https://placehold.co/100x100?text=Thumb"}
                                                        alt={img.alt || "Thumbnail"}
                                                        fill
                                                        className="w-full h-full object-cover"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                        priority={false}
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Preview Zoom Overlay - Desktop Only */}
                        <div className="hidden md:block">
                            {isHovering && !isFullscreenZoom && (
                                <div
                                    className="absolute top-0 right-[-320px] w-[300px] bg-white rounded-lg border border-black/20 p-3 z-10"
                                    style={{
                                        maxHeight: "400px",
                                        overflowY: "auto"
                                    }}
                                >
                                    <div className="text-xs text-black/60 mb-2 font-medium">Preview Zoom</div>
                                    <div
                                        className="w-full aspect-square rounded-lg overflow-hidden relative mb-3"
                                        style={{ height: "200px" }}
                                    >
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: `url(${mainImage}) no-repeat`,
                                                backgroundSize: "200%",
                                                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="text-sm font-medium text-black mb-2">
                                        {(product?.variants && product?.variants.find((v) => v.id === activeVariant)?.name) || "NATURAL FRESH"}
                                    </div>
                                    <div className="text-xs text-black/50">
                                        Stok: <span className="font-semibold">{product?.stock || 0}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Column - Product Info */}
                    <div className="middle-column flex-1 space-y-4">
                        <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h1 className="text-2xl font-bold text-black flex-1">{product?.name}</h1>
                                <button
                                    onClick={async () => {
                                        if (!isAuthenticated) {
                                            openLoginModal(async () => {
                                                if (product) {
                                                    const isCurrentlyFavorite = checkIsFavorite(product.id.toString());
                                                    if (isCurrentlyFavorite) {
                                                        await removeFromFavorites(product.id.toString());
                                                    } else {
                                                        // Create the proper image URL for favorites
                                                        let imageUrl = product.image || "";
                                                        if (product.image && !product.image.startsWith('http')) {
                                                          // If not a full URL, check if it's a file that needs the uploads path
                                                          if (product.image.includes('uploads/')) {
                                                            // Extract filename from uploads path
                                                            const filename = product.image.split('uploads/').pop();

                                                            // Get the base URL and remove any /api/v1 suffix for static files
                                                            let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                                            if (baseUrl.endsWith('/api/v1')) {
                                                              baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                                            }

                                                            imageUrl = `${baseUrl}/uploads/${filename}`;
                                                          } else if (!product.image.startsWith('/')) {
                                                            // It's a simple filename, so prepend the uploads path
                                                            // Get the base URL and remove any /api/v1 suffix for static files
                                                            let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                                            if (baseUrl.endsWith('/api/v1')) {
                                                              baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                                            }

                                                            imageUrl = `${baseUrl}/uploads/${product.image}`;
                                                          }
                                                        }

                                                        await addToFavorites({
                                                            id: product.id.toString(),
                                                            name: product.name,
                                                            price: product.price,
                                                            image: imageUrl
                                                        });
                                                    }
                                                }
                                            }, 'favorite');
                                            return;
                                        }

                                        if (product) {
                                            const isCurrentlyFavorite = checkIsFavorite(product.id.toString());
                                            if (isCurrentlyFavorite) {
                                                await removeFromFavorites(product.id.toString());
                                            } else {
                                                // Create the proper image URL for favorites
                                                let imageUrl = product.image || "";
                                                if (product.image && !product.image.startsWith('http')) {
                                                  // If not a full URL, check if it's a file that needs the uploads path
                                                  if (product.image.includes('uploads/')) {
                                                    // Extract filename from uploads path
                                                    const filename = product.image.split('uploads/').pop();

                                                    // Get the base URL and remove any /api/v1 suffix for static files
                                                    let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                                    if (baseUrl.endsWith('/api/v1')) {
                                                      baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                                    }

                                                    imageUrl = `${baseUrl}/uploads/${filename}`;
                                                  } else if (!product.image.startsWith('/')) {
                                                    // It's a simple filename, so prepend the uploads path
                                                    // Get the base URL and remove any /api/v1 suffix for static files
                                                    let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                                    if (baseUrl.endsWith('/api/v1')) {
                                                      baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                                    }

                                                    imageUrl = `${baseUrl}/uploads/${product.image}`;
                                                  }
                                                }

                                                await addToFavorites({
                                                    id: product.id.toString(),
                                                    name: product.name,
                                                    price: product.price,
                                                    image: imageUrl
                                                });
                                            }
                                        }
                                    }}
                                    className="ml-4 shrink-0"
                                    aria-label={checkIsFavorite(product?.id.toString() || '') ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <FaHeart
                                        className={`${checkIsFavorite(product?.id.toString() || '') ? 'text-red-500 fill-red-500' : 'text-black/40'} w-6 h-6`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm">Terjual</span>
                                    <span className="font-semibold text-sm">{product?.totalSold}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaStar className="w-4 h-4 fill-black text-black" />
                                    <span className="font-semibold text-sm">{product?.rating}</span>
                                    <span className="text-black/50 text-sm">
                                        ({product?.totalSold})
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="text-3xl font-bold text-black">
                                    {product?.price ? formatPrice(product.price) : "N/A"}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-3">
                                    Ukuran:{" "}
                                    <span className="font-normal text-black/60">
                                        {product?.has_variants
                                          ? (product?.variants && product?.variants.find((v) => v.id === activeVariant)?.size) || "Pilih ukuran"
                                          : "Satu ukuran"}
                                    </span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {product?.has_variants && product?.variants?.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setActiveVariant(variant.id)}
                                            disabled={variant.stock <= 0}
                                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 ${activeVariant === variant.id
                                                ? "border-black/50 text-black/80 bg-black/5"
                                                : variant.stock <= 0
                                                    ? "border-black/20 text-black/30 cursor-not-allowed"
                                                    : "border-black/20 hover:border-black/30"
                                                }`}
                                        >
                                            {variant.size}
                                            {variant.stock <= 0 && <span className="text-xs ml-1">(Habis)</span>}
                                        </button>
                                    ))}
                                    {!product?.has_variants && (
                                        <div className="px-4 py-2 rounded-lg border-2 border-black/20 text-sm text-black/60">
                                            Produk ini tidak memiliki varian ukuran
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-black/20 pt-">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => setActiveTab("detail")}
                                        className={`flex-1 pb-2 text-center font-medium border-b-2 border-black transition-colors}`}
                                    >
                                        Detail Produk
                                    </button>
                                </div>

                                {activeTab === "detail" && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-black">Kondisi:</span>
                                            <span className="font-semibold text-black/50">{product?.condition || "Baru"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-black ">Min. Pemesanan:</span>
                                            <span className="font-semibold text-black/50">{product?.minOrder || 1} Buah</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-black">Etalase:</span>
                                            <span className="font-semibold text-black/50">
                                                {product?.category || "General"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t-2">
                                
                                <p className="font-medium">Description:</p>

                                <div
                                    className={`text-black/70 ${!showFullDescription ? "line-clamp-4" : ""
                                        }`}
                                >
                                    <p className="mb-3">{product?.description || ""}</p>
                                    {product?.features && product?.features.length > 0 && (
                                        <div className="space-y-2">
                                            {product.features.map((feature, index) => (
                                                <p key={index} className="text-sm">
                                                    • {feature}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="text-black font-medium text-sm mt-2 hover:underline"
                                >
                                    {showFullDescription
                                        ? "Lihat Lebih Sedikit"
                                        : "Lihat Selengkapnya"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Purchase Card - Desktop Only */}
                    <div
                        className="hidden md:block purchase-card-container lg:w-[300px] sticky h-[400px]"
                        style={snapToHeader.purchaseCard ? { top: '70px' } : { top: '36px' }}
                    >
                        <div className="bg-white rounded-xl p-5 h-full flex flex-col justify-between border border-black/20">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">
                                        {(product?.variants && product?.variants.find((v) => v.id === activeVariant)?.icon) || "🌿"}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-black text-base">
                                        {(product?.variants && product?.variants.find((v) => v.id === activeVariant)?.name) ||
                                            product?.name}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="block text-xs text-black/60 mb-1 font-medium">
                                    Atur jumlah dan catatan
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border-2 border-black/20 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange("decrement")}
                                            className="px-3 py-1.5 text-black/60 hover:bg-black/5 text-sm disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 1;
                                                // Determine the max stock based on whether the product has variants
                                                const maxStock = product?.has_variants && product?.variants
                                                    ? (product.variants.find(v => v.id === activeVariant)?.stock || 1)
                                                    : (product?.stock || 1);
                                                if (val >= 1 && val <= maxStock) setQuantity(val);
                                            }}
                                            className="w-14 text-center text-sm border-0 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange("increment")}
                                            className="px-3 py-1.5 text-black/60 hover:bg-black/5 text-sm disabled:opacity-50"
                                            disabled={
                                                quantity >= (
                                                    product?.has_variants && product?.variants
                                                        ? (product.variants.find(v => v.id === activeVariant)?.stock || 1)
                                                        : (product?.stock || 1)
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-xs text-black/60">
                                        Stok:{" "}
                                        <span className="font-semibold text-black">
                                            {product?.has_variants && product?.variants
                                              ? (product.variants.find(v => v.id === activeVariant)?.stock || 0)
                                              : (product?.stock || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5 pt-3 border-t border-black/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-black/60 text-md">Subtotal</span>
                                    <span className="text-2xl font-bold text-black">
                                        {product?.price ? formatPrice(product.price * quantity) : "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={async () => {
                                        if (!isAuthenticated) {
                                            // If product has variants, check if selected variant is in stock
                                            if (product && product.has_variants) {
                                                const selectedVariant = product.variants?.find(v => v.id === activeVariant);
                                                if (selectedVariant && selectedVariant.stock <= 0) {
                                                    alert('Ukuran yang dipilih sedang habis');
                                                    return;
                                                }

                                                // Check if requested quantity exceeds available stock
                                                if (selectedVariant && selectedVariant.stock < quantity) {
                                                    alert(`Stok untuk ukuran ${selectedVariant.size} hanya tersedia ${selectedVariant.stock} buah`);
                                                    return;
                                                }
                                            }

                                            openLoginModal(async () => {
                                                if (product) {
                                                    await addToCart({
                                                        id: product.id,
                                                        name: product.name,
                                                        price: product.price,
                                                        image: mainImage,
                                                        quantity,
                                                        variantId: product.has_variants ? activeVariant : undefined,
                                                    });
                                                }
                                            }, 'cart');
                                            return;
                                        }

                                        if (product) {
                                            // If product has variants, validate that a variant is selected
                                            if (product.has_variants && !activeVariant) {
                                                alert('Silakan pilih ukuran terlebih dahulu');
                                                return;
                                            }

                                            // If product has variants, check if selected variant is in stock
                                            if (product.has_variants) {
                                                const selectedVariant = product.variants?.find(v => v.id === activeVariant);
                                                if (selectedVariant && selectedVariant.stock <= 0) {
                                                    alert('Ukuran yang dipilih sedang habis');
                                                    return;
                                                }

                                                // Check if requested quantity exceeds available stock
                                                if (selectedVariant && selectedVariant.stock < quantity) {
                                                    alert(`Stok untuk ukuran ${selectedVariant.size} hanya tersedia ${selectedVariant.stock} buah`);
                                                    return;
                                                }
                                            }

                                            await addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                image: mainImage,
                                                quantity,
                                                variantId: product.has_variants ? activeVariant : undefined,
                                            });
                                        }
                                    }}
                                    className="w-full bg-black text-white font-bold text-base py-2 rounded-xl transition-colors"
                                >
                                    + Keranjang
                                </button>
                                <button className="w-full border-2 border-black/90 text-black/90 font-bold text-base py-2 rounded-xl transition-colors">
                                    Beli Langsung
                                </button>
                            </div>

                        <div className="pt-4 border-t border-black/20 mt-auto">
                            <div className="flex justify-center gap-4">
                                <button className="flex items-center gap-1 text-black/60 hover:text-black text-xs">
                                <FaCommentAlt className="w-4 h-4" />
                                <span>Chat</span>
                                </button>
                                <button
                                onClick={async () => {
                                    if (!isAuthenticated) {
                                    openLoginModal(async () => {
                                        if (product) {
                                        const isCurrentlyFavorite = checkIsFavorite(product.id.toString());
                                        if (isCurrentlyFavorite) {
                                            await removeFromFavorites(product.id.toString());
                                        } else {
                                            // Create the proper image URL for favorites
                                            let imageUrl = product.image || "";
                                            if (product.image && !product.image.startsWith('http')) {
                                            // If not a full URL, check if it's a file that needs the uploads path
                                            if (product.image.includes('uploads/')) {
                                                // Extract filename from uploads path
                                                const filename = product.image.split('uploads/').pop();

                                                // Get the base URL and remove any /api/v1 suffix for static files
                                                let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                                if (baseUrl.endsWith('/api/v1')) {
                                                baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                                }

                                                imageUrl = `${baseUrl}/uploads/${filename}`;
                                            } else if (!product.image.startsWith('/')) {
                                                // It's a simple filename, so prepend the uploads path
                                                // Get the base URL and remove any /api/v1 suffix for static files
                                                let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                                if (baseUrl.endsWith('/api/v1')) {
                                                baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                                }

                                                imageUrl = `${baseUrl}/uploads/${product.image}`;
                                            }
                                            }

                                            await addToFavorites({
                                            id: product.id.toString(),
                                            name: product.name,
                                            price: product.price,
                                            image: imageUrl
                                            });
                                        }
                                        }
                                    }, 'favorite');
                                    return;
                                    }

                                    if (product) {
                                    const isCurrentlyFavorite = checkIsFavorite(product.id.toString());
                                    if (isCurrentlyFavorite) {
                                        await removeFromFavorites(product.id.toString());
                                    } else {
                                        // Create the proper image URL for favorites
                                        let imageUrl = product.image || "";
                                        if (product.image && !product.image.startsWith('http')) {
                                        // If not a full URL, check if it's a file that needs the uploads path
                                        if (product.image.includes('uploads/')) {
                                            // Extract filename from uploads path
                                            const filename = product.image.split('uploads/').pop();

                                            // Get the base URL and remove any /api/v1 suffix for static files
                                            let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                            if (baseUrl.endsWith('/api/v1')) {
                                            baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                            }

                                            imageUrl = `${baseUrl}/uploads/${filename}`;
                                        } else if (!product.image.startsWith('/')) {
                                            // It's a simple filename, so prepend the uploads path
                                            // Get the base URL and remove any /api/v1 suffix for static files
                                            let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                            if (baseUrl.endsWith('/api/v1')) {
                                            baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                            }

                                            imageUrl = `${baseUrl}/uploads/${product.image}`;
                                        }
                                        }

                                        await addToFavorites({
                                        id: product.id.toString(),
                                        name: product.name,
                                        price: product.price,
                                        image: imageUrl
                                        });
                                    }
                                    }
                                }}
                                className="flex items-center gap-1 text-black/60 hover:text-black text-xs"
                                >
                                <FaHeart className={`${checkIsFavorite(product?.id.toString() || '') ? 'text-red-500 fill-red-500' : 'text-black/40'} w-4 h-4`} />
                                <span>Favourite</span>
                                </button>
                                <button
                                onClick={async () => {
                                    const productUrl = window.location.href;
                                    try {
                                    await navigator.clipboard.writeText(productUrl);
                                    alert('Link produk berhasil disalin!');
                                    } catch (err) {
                                    console.error('Failed to copy: ', err);
                                    // Fallback for older browsers
                                    const textArea = document.createElement('textarea');
                                    textArea.value = productUrl;
                                    document.body.appendChild(textArea);
                                    textArea.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(textArea);
                                    alert('Link produk berhasil disalin!');
                                    }
                                }}
                                className="flex items-center gap-1 text-black/60 hover:text-black text-xs"
                                >
                                <FaShareAlt className="w-4 h-4" />
                                <span>Share</span>
                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Zoom Overlay */}
            {isFullscreenZoom && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-xl z-9999 flex items-center justify-center p-4"
                    onClick={closeFullscreenZoom}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-2xl z-10"
                        onClick={closeFullscreenZoom}
                        aria-label="Close fullscreen"
                    >
                        <FaTimes />
                    </button>

                    <div
                        className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {fullscreenImage?.includes('uploads') ? (
                            <img
                                src={(() => {
                                    // Extract just the filename from the uploads path
                                    let filename = fullscreenImage;
                                    if (fullscreenImage?.includes('uploads/')) {
                                      filename = fullscreenImage.split('uploads/').pop() || fullscreenImage;
                                    }

                                    // Get the base URL and remove any /api/v1 suffix for static files
                                    let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                                    if (baseUrl.endsWith('/api/v1')) {
                                      baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                                    }

                                    // Use a relative URL that will be proxied to the backend
                                    return `${baseUrl}/uploads/${filename}`;
                                })()}
                                alt="Fullscreen view"
                                className="max-h-[85vh] w-auto object-contain rounded-xl"
                            />
                        ) : (
                            <Image
                                src={fullscreenImage}
                                alt="Fullscreen view"
                                width={800}
                                height={600}
                                className="max-h-[85vh] object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Product Detail Bottom Bar - Mobile Only */}
            <div className="md:hidden">
                <ProductDetailBottomBar
                    product={product}
                    mainImage={mainImage}
                    initialQuantity={quantity}
                    initialVariant={activeVariant}
                    onVariantChange={setActiveVariant}
                    onQuantityChange={setQuantity}
                />
            </div>
        </>
    );
});

ProductDetail.displayName = 'ProductDetail';

export default ProductDetail;