'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PaginatedProducts from '@/components/product/PaginatedProducts';

export default function ProductListingPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const store = searchParams.get('store');
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  
  return (
    <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {category ? `${category} Products` : 'All Products'}
      </h1>
      
      <PaginatedProducts 
        limit={12} 
        category={category || undefined}
        store={store || undefined}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
    </div>
  );
}