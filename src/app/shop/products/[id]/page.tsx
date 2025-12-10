// src/app/shop/products/[id]/page.tsx
import ProductDetailWrapper from '@/components/product/ProductDetailWrapper';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return <ProductDetailWrapper productId={id} />;
}