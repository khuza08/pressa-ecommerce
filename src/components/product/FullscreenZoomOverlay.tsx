// src/components/product/FullscreenZoomOverlay.tsx
'use client';

import { useEffect } from "react";
import { FaExpand, FaSearchPlus, FaTimes } from "react-icons/fa";

interface FullscreenZoomOverlayProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenZoomOverlay({ 
  imageUrl, 
  isOpen, 
  onClose 
}: FullscreenZoomOverlayProps) {
  // Handle keyboard escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Prevent scrolling when fullscreen zoom is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#242424]/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-2xl z-10"
        onClick={onClose}
        aria-label="Close fullscreen"
      >
        <FaTimes />
      </button>

      <div
        className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Fullscreen view"
          className="max-h-[85vh] object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/800x600?text=Image+Not+Found";
          }}
        />
      </div>
    </div>
  );
}