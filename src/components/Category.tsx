// src/components/Category.tsx
const categories = [
  { name: "Dress & frock", count: 53, icon: "dress.svg" },
  { name: "Winter wear", count: 58, icon: "coat.svg" },
  { name: "Glasses & lens", count: 68, icon: "glasses.svg" },
  { name: "Shorts & jeans", count: 84, icon: "shorts.svg" },
  { name: "T-shirts", count: 35, icon: "tee.svg" },
  { name: "Jacket", count: 16, icon: "jacket.svg" },
  { name: "Watch", count: 27, icon: "watch.svg" },
  { name: "Hat & caps", count: 39, icon: "hat.svg" },
];

export default function Category() {
  return (
    <div className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4">
          {categories.map((cat, idx) => (
            <a
              key={idx}
              href="#"
              className="flex-shrink-0 w-32 flex flex-col items-center text-center p-4 border rounded-xl hover:shadow-md transition"
            >
              <div className="bg-gray-200 rounded-full p-3 mb-2">
                <img src={`/assets/images/icons/${cat.icon}`} alt={cat.name} className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-sm">{cat.name}</h3>
              <span className="text-xs text-gray-500">({cat.count})</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}