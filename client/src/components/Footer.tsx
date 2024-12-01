export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">ShopHub</h3>
            <p className="text-sm">Your one-stop shop for premium products.</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-white">
                  Shop
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-white">
                  Categories
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-white">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-white">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Newsletter
            </h4>
            <p className="text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <div className="flex flex-col 2xl:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-6/12 md:w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none"
              />
              <div>
                <button className="px-4 py-2 rounded-lg button-gradient">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © 2024 ShopHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
