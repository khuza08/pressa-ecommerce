// src/app/page.tsx
import Carousel from "@/components/product/Carousel";
import CategorySection from "@/components/product/Category";
import ProductGrid from "@/components/product/Products";

export default function Home() {
  return (
    <div id="app-container" className="w-full md:w-[90vw] lg:w-[80vw] mx-auto">
      <Carousel />
      <CategorySection />
      <ProductGrid />
    </div>
  );
}