// src/app/products/[id]/page.tsx
import ProductDetail from '@/components/ProductDetail';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProductDetail productId={params.id} />
  );
}