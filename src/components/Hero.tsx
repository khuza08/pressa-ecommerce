// src/components/Hero.tsx
export default function Hero() {
  return (
    <div className="relative bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 relative w-full md:w-[600px] h-64 md:h-96 rounded-xl overflow-hidden">
              <img
                src={`/assets/images/banner-${i}.jpg`}
                alt={`Banner ${i}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center pl-6 text-white">
                <p className="text-sm">Trending item</p>
                <h2 className="text-2xl md:text-4xl font-bold mt-1">Women's latest fashion sale</h2>
                <p className="mt-2">starting at $<b>20</b>.00</p>
                <button className="mt-4 bg-white text-black px-4 py-2 rounded w-fit">Shop now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}