// src/app/page.tsx
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import CategorySection from "@/components/Category";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="app-container" className="min-h-screen mx-auto">
      <Header />
      <Carousel />
      <CategorySection /> 
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">New Products</h2>
      </div>
      <ProductGrid />
      <Footer />
    </div>
  );
}