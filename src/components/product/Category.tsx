// src/components/product/Category.tsx
'use client';
import { useState, memo, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  FiPlus,
  FiShoppingBag,
  FiCpu,
  FiHome,
  FiActivity,
  FiBook,
  FiGift
} from "react-icons/fi";

interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

const Category = memo(() => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/category?category=${encodeURIComponent(categoryName)}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        const categoriesApiUrl = baseUrl.endsWith('/api/v1') ? `${baseUrl}/categories` : `${baseUrl}/api/v1/categories`;

        // Fetch categories
        const categoriesResponse = await fetch(categoriesApiUrl);
        let categoriesData: Category[] = [];
        if (categoriesResponse.ok) {
          categoriesData = await categoriesResponse.json();
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
          console.log('✅ Categories fetched:', categoriesData);
        } else {
          console.error('❌ Failed to fetch categories:', categoriesResponse.status);
        }

        // Fetch all products to count by category
        const productsApiUrl = `${baseUrl}/products`;
        console.log('🔍 Fetching from:', productsApiUrl);
        const productsResponse = await fetch(productsApiUrl);
        console.log('📡 Response status:', productsResponse.status);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('📦 Raw response:', productsData);

          // Extract products from pagination rather than assuming direct array 
          let products = [];
          if (Array.isArray(productsData)) {
            // If API returns array directly
            products = productsData;
          } else if (productsData.data && Array.isArray(productsData.data)) {
            // If API returns pagination object with 'data' property
            products = productsData.data;
          }

          console.log('✅ Products fetched:', products.length);
          console.log('📦 Sample products:', products.slice(0, 3).map((p: any) => ({
            name: p.name,
            category: p.category
          })));

          // Simple exact match counting (case-insensitive)
          const counts: Record<string, number> = {};

          categoriesData.forEach(category => {
            // Exact match, case-insensitive
            const matchingProducts = products.filter((product: any) => {
              if (!product.category) return false;

              // Simple case-insensitive comparison
              const productCat = product.category.trim().toLowerCase();
              const categoryCat = category.name.trim().toLowerCase();

              return productCat === categoryCat;
            });

            counts[category.name] = matchingProducts.length;

            console.log(`📊 Category "${category.name}": ${matchingProducts.length} products`);
            if (matchingProducts.length > 0) {
              console.log('   Products:', matchingProducts.map((p: any) => p.name));
            }
          });

          setCategoryCounts(counts);
          console.log('✅ Final counts:', counts);
        } else {
          console.error('❌ Failed to fetch products:', productsResponse.status);
          // Set default counts to 0
          const defaultCounts: Record<string, number> = {};
          categoriesData.forEach(category => {
            defaultCounts[category.name] = 0;
          });
          setCategoryCounts(defaultCounts);
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map category names to icons dynamically
  const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('fashion') || lowerName.includes('shirt') || lowerName.includes('dress') || lowerName.includes('clothes') || lowerName.includes('sweater') || lowerName.includes('jeans')) {
      return FiShoppingBag;
    } else if (lowerName.includes('electronic') || lowerName.includes('phone') || lowerName.includes('computer') || lowerName.includes('tech')) {
      return FiCpu;
    } else if (lowerName.includes('home') || lowerName.includes('living') || lowerName.includes('kitchen') || lowerName.includes('furniture')) {
      return FiHome;
    } else if (lowerName.includes('sport') || lowerName.includes('fitness') || lowerName.includes('exercise')) {
      return FiActivity;
    } else if (lowerName.includes('book') || lowerName.includes('education')) {
      return FiBook;
    } else if (lowerName.includes('toy') || lowerName.includes('game') || lowerName.includes('kids')) {
      return FiGift;
    } else {
      return FiPlus;
    }
  };

  if (loading) {
    return (
      <div className="relative w-full md:w-[90vw] lg:w-[90vw] mx-auto py-5">
        <div className="relative overflow-hidden">
          <div className="flex justify-center items-center h-32">
            <p>Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full md:w-[90vw] lg:w-[90vw] mx-auto py-5">
      <div className="relative overflow-hidden">
        {/* Desktop/Tablet View - Full Cards */}
        <div className="hidden md:block">
          <div
            className="flex overflow-x-auto gap-4 pb-4 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              return (
                <div
                  key={category.id}
                  className="category-card shrink-0 w-[calc(25%-12px)]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div
                    className="rounded-lg overflow-hidden border-2 border-black/10 cursor-pointer h-24 transition-all hover:border-black/40"
                    onClick={() => handleCategoryClick(category.name)}
                    onMouseEnter={() => setHoveredCategory(1)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="flex h-full">
                      <div className="w-1/3 h-full bg-[#242424]/10 flex items-center justify-center">
                        <IconComponent className="text-3xl text-black/70" />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-black text-sm truncate">
                            {category.name}
                          </h3>
                          <span className="text-xs text-black/50 whitespace-nowrap">
                            ({categoryCounts[category.name] || 0})
                          </span>
                        </div>
                        <button
                          className="flex items-center text-xs text-black/70 hover:text-black transition font-medium"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent click
                            handleCategoryClick(category.name);
                          }}
                        >
                          Show All
                          <FiPlus className="ml-1 w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View - Scrollable Icons */}
        <div className="md:hidden">
          <div
            className="flex overflow-x-auto gap-4 scroll-smooth px-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              return (
                <div
                  key={category.id}
                  className="category-icon flex flex-col items-center shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div
                    className="w-16 h-16 rounded-lg bg-[#242424]/10 flex items-center justify-center mb-2 cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                    onMouseEnter={() => setHoveredCategory(1)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <IconComponent className="text-2xl text-black/70" />
                  </div>
                  <span
                    className="text-xs text-black/70 text-center w-16 cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {category.name} ({categoryCounts[category.name] || 0})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

Category.displayName = 'Category';

export default Category;