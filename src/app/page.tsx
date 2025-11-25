// src/app/page.tsx
import Header from "@/components/Header";
import Carousel from "@/components/Carousel";
import CategorySection from "@/components/Category";
import ProductGrid from "@/components/Products";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="app-container" className="min-h-screen mx-auto">
      <Header />
      <Carousel />
      <CategorySection /> 
      <ProductGrid />
      <Footer />
    </div>
  );
}