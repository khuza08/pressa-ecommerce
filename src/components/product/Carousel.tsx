// src/components/product/Carousel.tsx
'use client';

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import { useCarouselItems } from '@/hooks/useSWRProducts';

import { memo } from 'react';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  imageType?: 'url' | 'file'; // Added image type field
  link?: string; // Optional link when carousel is clicked
  order: number;
}

const Carousel = memo(() => {
  const { carouselItems: slides, isLoading, isError } = useCarouselItems();
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative w-full md:w-[90vw] lg:w-[90vw] mx-auto overflow-hidden rounded-lg h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <p>Loading carousel...</p>
      </div>
    );
  }

  // Show error state
  if (isError) {
    console.error('Error loading carousel items');
    return (
      <div className="relative w-full md:w-[90vw] lg:w-[90vw] mx-auto overflow-hidden rounded-lg h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <p className="text-red-500">Error loading carousel</p>
      </div>
    );
  }

  // If no slides available
  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full md:w-[90vw] lg:w-[90vw] mx-auto overflow-hidden rounded-lg h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <p>No carousel items available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full md:w-[90vw] lg:w-[90vw] mx-auto overflow-hidden rounded-lg">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="w-full h-full relative">
              <Image
                src={slide.imageType === 'file' ? `/uploads/${slide.image}` : slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 90vw"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-2xl">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-lg mb-6">{slide.description}</p>
                  {slide.link && (
                    <a
                      href={slide.link}
                      className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-black/90 transition-colors"
                    >
                      Shop Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="text-xl" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <FiChevronRight className="text-xl" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

Carousel.displayName = 'Carousel';

export default Carousel;