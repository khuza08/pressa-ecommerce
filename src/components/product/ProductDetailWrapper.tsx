'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import ProductDetail with loading state
const DynamicProductDetail = dynamic(
  () => import('@/components/product/ProductDetail'),
  {
    loading: () => (
      <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto mb-10 flex justify-center items-center h-64">
        <p className="text-lg">Loading product details...</p>
      </div>
    ),
    ssr: false // Disable SSR for client-side only component
  }
);

interface ProductDetailWrapperProps {
  productId: string;
}

export default function ProductDetailWrapper({ productId }: ProductDetailWrapperProps) {
  return (
    <Suspense fallback={
      <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto mb-10 flex justify-center items-center h-64">
        <p className="text-lg">Loading product...</p>
      </div>
    }>
      <DynamicProductDetail productId={productId} />
    </Suspense>
  );
}