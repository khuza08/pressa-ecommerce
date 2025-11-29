// src/app/page.tsx
import Carousel from "@/components/Carousel";
import CategorySection from "@/components/Category";
import ProductGrid from "@/components/Products";

export default function Home() {
  return (
    <div id="app-container" className="min-h-screen mx-auto">
      <Carousel />
      <CategorySection />
      <ProductGrid />
    </div>
  );
}