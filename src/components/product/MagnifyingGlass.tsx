// src/components/product/MagnifyingGlass.tsx
'use client';

import { useState, useRef, MouseEvent } from "react";

interface MagnifyingGlassProps {
  image: string;
  enabled: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onFullscreenRequest: (imageUrl: string) => void;
  product: any; // Product type dari ProductDetail (bisa null saat loading)
}

export default function MagnifyingGlass({
  image,
  enabled,
  onHoverStart,
  onHoverEnd,
  onFullscreenRequest,
  product
}: MagnifyingGlassProps) {
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
    setLensPosition({
      x: e.clientX - left - 50, // 50px = half of lens width
      y: e.clientY - top - 50  // 50px = half of lens height
    });
  };

  return (
    <div
      ref={imageRef}
      className="relative overflow-hidden aspect-square"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`w-full h-full relative overflow-hidden transition-all duration-200 ${enabled ? "brightness-75" : ""}`}
      >
        <img
          src={image}
          alt="Product main image"
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/600x600?text=Product+Image";
          }}
        />

        {/* Lens Zoom Overlay */}
        {enabled && (
          <>
            {/* Lens (magnifying glass) */}
            <div
              className="absolute pointer-events-none z-20 border-2 border-white rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: "100px",
                height: "100px",
                left: `${lensPosition.x}px`,
                top: `${lensPosition.y}px`,
                background: `url(${image}) no-repeat`,
                backgroundSize: "200%",
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </>
        )}

        {/* Fullscreen Zoom Button */}
        <button
          onClick={() => onFullscreenRequest(image)}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 transition-all z-10"
          aria-label="Zoom image"
        >
          <span className="text-black/80 text-lg">🔍</span>
        </button>
      </div>

      {/* Preview Zoom Overlay next to product image */}
      {enabled && (
        <div
          className="absolute top-0 right-[-320px] w-[300px] bg-white rounded-xl p-4 z-30 border border-black/20"
          style={{
            maxHeight: "400px",
            overflowY: "auto"
          }}
        >
          <div className="text-xs text-blue-600 mb-2 font-medium uppercase tracking-wide">Preview Zoom</div>
          <div
            className="w-full aspect-square rounded-lg overflow-hidden relative mb-3 border border-black/30"
            style={{ height: "200px" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `url(${image}) no-repeat`,
                backgroundSize: "200%",
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          </div>
          <div className="text-sm font-medium text-black mb-1">
            {product?.name || "Product Detail"}
          </div>
          <div className="text-xs text-black/50">
            Stok: <span className="font-semibold">{product?.stock || 0}</span>
          </div>
        </div>
      )}
    </div>
  );
}