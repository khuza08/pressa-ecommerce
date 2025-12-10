// src/app/products/[id]/page.tsx
import ProductDetailWrapper from '@/components/product/ProductDetailWrapper';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ProductDetailWrapper productId={id} />;
}