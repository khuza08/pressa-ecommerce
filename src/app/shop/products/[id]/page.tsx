// src/app/shop/products/[id]/page.tsx
import ProductDetail from '@/components/product/ProductDetail';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <ProductDetail productId={id} />
  );
}