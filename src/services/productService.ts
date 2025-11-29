// src/services/productService.ts
// Mock data service - in real application, this would fetch from an API

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: Array<{
    url: string;
    alt: string;
  }>;
  rating: number;
  totalSold: string;
  store: string;
  description?: string;
  category?: string;
  variants?: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  stock?: number;
  condition?: string;
  minOrder?: number;
  features?: string[];
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.5,
    totalSold: "1.2k",
    store: "Time Store"
  },
  {
    id: "2", 
    name: "Sunglasses",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    rating: 4.3,
    totalSold: "890",
    store: "Fashion Hub"
  },
  {
    id: "3",
    name: "Headphones",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.7,
    totalSold: "2.1k",
    store: "Audio Shop"
  },
  {
    id: "4",
    name: "Sneakers",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.6,
    totalSold: "3.5k",
    store: "Shoe Palace"
  },
  {
    id: "13",
    name: "Leather Jacket",
    price: 150,
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800",
        alt: "Product 1",
      },
      {
        url: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800",
        alt: "Product 2",
      },
      {
        url: "https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=800",
        alt: "Product 3",
      },
      {
        url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
        alt: "Product 4",
      },
    ],
    rating: 4.9,
    totalSold: "10 rb+",
    store: "Fashion Store",
    description: "Tahukah anda bakteri merupakan penyebab utama timbulnya bau tidak sedap?",
    category: "OTOMOTIF",
    variants: [
      { id: "natural", name: "NATURAL FRESH", icon: "🌿" },
      { id: "coffee", name: "COFFEE MILK", icon: "☕" },
      { id: "black", name: "BLACK ICE", icon: "❄️" },
      { id: "laundry", name: "LAUNDRY FRESH", icon: "🧺" },
      { id: "gelato", name: "GELATO ICECREAM", icon: "🍦" },
    ],
    stock: 1317,
    condition: "Baru",
    minOrder: 1,
    features: [
      "Teknologi baru, lebih cepat basmi bakteri penyebab bau",
      "Tahan lebih lama; aroma segar dan nyaman",
      "Bahan natural, aman untuk ibu hamil & bayi serta hewan peliharaan",
      "Tidak berbentuk aerosol yang mudah meledak",
    ]
  }
];

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.find(product => product.id === id);
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.filter(product => 
      product.category?.toLowerCase().includes(category.toLowerCase())
    );
  },
};