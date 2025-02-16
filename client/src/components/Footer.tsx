export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">HITEKBD</h3>
            <p className="text-sm">Your one-stop shop for premium products. Get the best product at best price. </p>
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
                <a href="/shop" className="hover:text-white">
                  Categories
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

        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © 2024 HitekBD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
