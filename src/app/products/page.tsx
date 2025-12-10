import PaginatedProducts from '@/components/product/PaginatedProducts';

export default function ProductsPage() {
  return (
    <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <PaginatedProducts limit={12} />
    </div>
  );
}