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

export default function ProductDetail({ productId }: { productId: string }) {
    const thumbnailRef = useRef<HTMLDivElement>(null);
    const [showPrevButton, setShowPrevButton] = useState(false);
    const [showNextButton, setShowNextButton] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState("");
    const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCart();

    // Update tombol berdasarkan scroll position
    const updateScrollButtons = () => {
        if (!thumbnailRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = thumbnailRef.current;
        setShowPrevButton(scrollLeft > 0);
        setShowNextButton(scrollLeft + clientWidth < scrollWidth - 1);
    };

    useEffect(() => {
        const ref = thumbnailRef.current;
        if (!ref) return;

        updateScrollButtons();

        const handleScroll = () => {
            updateScrollButtons();
        };

        ref.addEventListener("scroll", handleScroll);

        return () => {
            ref.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollThumbnails = (direction: "left" | "right") => {
        if (thumbnailRef.current) {
            const scrollAmount = 120;
            thumbnailRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            setTimeout(updateScrollButtons, 300);
        }
    };

    // Update posisi zoom saat hover
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

    // Prevent wheel scroll when hover magnifier is active
    useEffect(() => {
        const preventDefault = (e: WheelEvent) => {
            if (isHovering && !isFullscreenZoom) {
                e.preventDefault();
            }
        };

        if (isHovering && !isFullscreenZoom) {
            window.addEventListener('wheel', preventDefault, { passive: false });
        }

        return () => {
            window.removeEventListener('wheel', preventDefault);
        };
    }, [isHovering, isFullscreenZoom]);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
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
                setMainImage(product.image);
            } else {
                setMainImage("https://placehold.co/600x600?text=Product+Image");
            }
        }
    }, [product]);

    const handleQuantityChange = (type: "increment" | "decrement") => {
        if (!product) return;

        if (type === "increment" && quantity < (product.stock || 999)) {
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
            <div className="w-[80vw] mx-auto mb-10 flex justify-center items-center h-64">
                <p className="text-lg">Loading product...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-[80vw] mx-auto mb-10">
                <p className="text-lg text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-[80vw] mx-auto mb-10">
                <p className="text-lg">Product not found</p>
            </div>
        );
    }

    return (
        <>
            {/* Changed max-width to responsive width */}
            <div className="w-[80vw] mx-auto mb-10">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left Column - Product Images */}
                    <div className="w-[280px] relative">
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm sticky top-[150px] flex flex-col">
                            {/* Main Image with Zoom */}
                            <div
                                className="aspect-square relative overflow-hidden"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <img
                                    src={mainImage || product.image || "https://placehold.co/600x600?text=Product+Image"}
                                    alt={product.name || "Product image"}
                                    className={`w-full h-full rounded-lg object-cover transition-all duration-200 ${isHovering ? "blur-sm" : ""
                                        }`}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://placehold.co/600x600?text=No+Image";
                                    }}
                                />
                                
                                {/* Lens Zoom Overlay */}
                                {isHovering && !isFullscreenZoom && (
                                    <>
                                        {/* Lens (kaca pembesar) */}
                                        <div
                                            className="absolute pointer-events-none z-20 border-2 border-white rounded-full shadow-lg"
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                left: `${lensPosition.x}px`,
                                                top: `${lensPosition.y}px`,
                                                background: `url(${mainImage}) no-repeat`,
                                                backgroundSize: "200%",
                                                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                transform: "translate(-50%, -50%)",
                                            }}
                                        />
                                        {/* Kaca pembesar ikon */}
                                        <div 
                                            className="absolute z-30 pointer-events-none"
                                            style={{
                                                left: `${lensPosition.x}px`,
                                                top: `${lensPosition.y}px`,
                                                transform: "translate(-50%, -50%)",
                                            }}
                                        >
                                            <FaSearchPlus className="text-white text-lg" />
                                        </div>
                                    </>
                                )}
                                
                                {/* Fullscreen Zoom Button */}
                                <button
                                    onClick={() => handleFullscreenZoom(mainImage)}
                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                                    aria-label="Zoom image"
                                >
                                    <FaExpand className="text-black/80" />
                                </button>
                            </div>

                            {/* Thumbnail Container */}
                            <div className="relative p-2">
                                {showPrevButton && (
                                    <button
                                        onClick={() => scrollThumbnails("left")}
                                        className="absolute -left-1 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-1.5 shadow-lg border"
                                        aria-label="Previous image"
                                    >
                                        <FaChevronLeft size={16} className="text-black/80" />
                                    </button>
                                )}

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
                                    {(product.images && product.images.length > 0 ? product.images : [{url: product.image, alt: product.name}]).map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setMainImage(img.url)}
                                            className={`shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${mainImage === img.url
                                                ? "border-black/50"
                                                : "border-black/20"
                                                }`}
                                        >
                                            <img
                                                src={img.url || "https://placehold.co/100x100?text=Thumb"}
                                                alt={img.alt || "Thumbnail"}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "https://placehold.co/100x100?text=No+Image";
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {showNextButton && (
                                    <button
                                        onClick={() => scrollThumbnails("right")}
                                        className="absolute -right-1 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-1.5 shadow-lg border"
                                        aria-label="Next image"
                                    >
                                        <FaChevronRight size={16} className="text-black/80" />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Preview Zoom Overlay di sebelah gambar produk */}
                        {isHovering && !isFullscreenZoom && (
                            <div 
                                className="absolute top-0 right-[-320px] w-[300px] bg-white rounded-lg shadow-lg p-3 z-10"
                                style={{ 
                                    maxHeight: "400px",
                                    overflowY: "auto"
                                }}
                            >
                                <div className="text-xs text-gray-600 mb-2 font-medium">Preview Zoom</div>
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
                                <div className="text-sm font-medium text-gray-900 mb-2">
                                    {(product.variants && product.variants.find((v) => v.id === activeVariant)?.name) || "NATURAL FRESH"}
                                </div>
                                <div className="text-xs text-black/50">
                                    Stok: <span className="font-semibold">{product.stock || 0}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Middle Column - Product Info */}
                    <div className="flex-1 space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm">Terjual</span>
                                    <span className="font-semibold text-sm">{product.totalSold}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaStar className="w-4 h-4 fill-black text-black" />
                                    <span className="font-semibold text-sm">{product.rating}</span>
                                    <span className="text-gray-500 text-sm">
                                        ({product.totalSold})
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="text-3xl font-bold text-gray-900">
                                    {formatPrice(product.price)}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-3">
                                    Pilih aroma:{" "}
                                    <span className="font-normal text-gray-600">
                                        {(product.variants && product.variants.find((v) => v.id === activeVariant)?.name) || product.name}
                                    </span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants?.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setActiveVariant(variant.id)}
                                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 ${activeVariant === variant.id
                                                ? "border-black/50 text-black/80"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            {variant.icon && <span>{variant.icon}</span>}
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => setActiveTab("detail")}
                                        className={`flex-1 pb-2 text-center font-medium border-b-2 transition-colors ${activeTab === "detail"
                                            ? "border-black/50 text-black/80"
                                            : "border-transparent text-black/50"
                                            }`}
                                    >
                                        Detail Produk
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("info")}
                                        className={`flex-1 pb-2 text-center font-medium border-b-2 transition-colors ${activeTab === "info"
                                            ? "border-black/50 text-black/80"
                                            : "border-transparent text-black/50"
                                            }`}
                                    >
                                        Info Penting
                                    </button>
                                </div>

                                {activeTab === "detail" && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-black">Kondisi:</span>
                                            <span className="font-semibold text-black/50">{product.condition || "Baru"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-black ">Min. Pemesanan:</span>
                                            <span className="font-semibold text-black/50">{product.minOrder || 1} Buah</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-black">Etalase:</span>
                                            <span className="font-semibold text-black/50">
                                                {product.category || "General"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                <div
                                    className={`text-gray-700 ${!showFullDescription ? "line-clamp-4" : ""
                                        }`}
                                >
                                    <p className="mb-3">{product.description || ""}</p>
                                    {product.features && product.features.length > 0 && (
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

                    {/* Right Column - Purchase Card */}
                    <div className="w-full lg:w-[300px] sticky top-36 h-[400px]">
                        <div className="bg-white rounded-xl p-5 shadow-sm h-full flex flex-col justify-between border border-gray-100">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">
                                        {(product.variants && product.variants.find((v) => v.id === activeVariant)?.icon) || "🌿"}
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 text-base">
                                        {(product.variants && product.variants.find((v) => v.id === activeVariant)?.name) ||
                                            product.name}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="block text-xs text-gray-600 mb-1 font-medium">
                                    Atur jumlah dan catatan
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange("decrement")}
                                            className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 1;
                                                if (val >= 1 && val <= (product.stock || 999)) setQuantity(val);
                                            }}
                                            className="w-14 text-center text-sm border-0 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange("increment")}
                                            className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50"
                                            disabled={quantity >= (product.stock || 999)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Stok:{" "}
                                        <span className="font-semibold text-gray-900">{product.stock || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5 pt-3 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-md">Subtotal</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        {formatPrice(product.price * quantity)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => addToCart(product, quantity, undefined, undefined)}
                                    className="w-full bg-black text-white font-bold text-base py-2 rounded-xl transition-colors shadow-md"
                                >
                                    + Keranjang
                                </button>
                                <button className="w-full border-2 border-black/80 text-black/80 font-bold text-base py-2 rounded-xl transition-colors">
                                    Beli Langsung
                                </button>
                            </div>

                            <div className="pt-4 border-t mt-auto">
                                <div className="flex gap-4">
                                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs">
                                        <FaCommentAlt className="w-4 h-4" />
                                        <span>Chat</span>
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs">
                                        <FaHeart className="w-4 h-4" />
                                        <span>Wishlist</span>
                                    </button>
                                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs">
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
                    className="fixed inset-0 bg-black/90 z-9999 flex items-center justify-center p-4"
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
                        <img 
                            src={fullscreenImage} 
                            alt="Fullscreen view" 
                            className="max-h-[85vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}