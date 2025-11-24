// src/components/ProductGrid.tsx
import { FiHeart, FiShoppingBag } from 'react-icons/fi';

export default function ProductGrid() {
    const products = Array(12).fill({
        id: 1,
        name: 'Mens Winter Leathers Jackets',
        price: 48,
        originalPrice: 75,
        category: 'jacket',
        image: '/assets/images/products/jacket-3.jpg',
    });

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((p, i) => (
                <div
                    key={i}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                    <div className="relative">
                        <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            15%
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                            <button
                                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                                aria-label="Add to wishlist"
                            >
                                <FiHeart className="text-xl text-gray-700" />
                            </button>
                            <button
                                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                                aria-label="Add to cart"
                            >
                                <FiShoppingBag className="text-xl text-gray-700" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <span className="text-xs text-gray-500">{p.category}</span>
                        <h3 className="font-medium text-sm mt-1 line-clamp-1">{p.name}</h3>
                        <div className="flex items-center mt-1">
                            <span className="font-bold">${p.price}.00</span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                                ${p.originalPrice}.00
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}