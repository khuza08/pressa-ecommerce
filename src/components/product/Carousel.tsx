// src/components/product/Carousel.tsx
'use client';

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Carousel() {
  // Sample data - in a real app, this would come from props or state
  const slides = [
    {
      id: 1,
      title: "Summer Collection",
      subtitle: "New Arrivals",
      description: "Discover our new summer collection",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5cd?w=1200&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Winter Sale",
      subtitle: "Up to 50% off",
      description: "Winter collection with great discounts",
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1200&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Accessories",
      subtitle: "Complete Your Look",
      description: "New accessories to complement your style",
      image: "https://images.unsplash.com/photo-1591350824014-86ec1aec60a0?w=1200&h=600&fit=crop",
    },
  ];

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

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-2xl">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-2">{slide.subtitle}</p>
                  <p className="text-base md:text-lg mb-6">{slide.description}</p>
                  <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                    Shop Now
                  </button>
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
}