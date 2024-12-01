import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { featuredProducts, latestProducts } from '../data/products';

export default function Home() {
  return (
    <div>
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Products */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <button className="text-indigo-600 hover:text-indigo-500 font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="mb-16">
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90" />
            <div className="relative h-[200px] flex items-center">
              <img
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80"
                alt="Promotional Banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative px-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Special Offer</h2>
                <p className="text-lg mb-4">Get 20% off on all accessories</p>
                <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Products */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Products</h2>
            <button className="text-indigo-600 hover:text-indigo-500 font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}