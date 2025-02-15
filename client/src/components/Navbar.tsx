import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, LogOut, UserCircle, User2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchQuery = formData.get('search') as string;
    navigate(`/shop?search=${searchQuery}`);
  };
  return (
    <nav className="bg-white border  sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl flex justify-center items-center font-bold text-indigo-600"
            >
              <img src="/logoIcon.png" className="h-10" alt="" />
              <img src="/logo.png" className="h-7 mt-1" alt="" />
            </Link>
          </div>

          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-[30rem] px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute right-5 top-3 text-gray-400 h-6 w-6" />
            </form>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-gradient-to-r from-[#37c3fa]/10 to-[#ce62f2]/10 transition-colors duration-200 group"
            >
              <div className="relative flex items-center">
                <ShoppingCart
                  size={28}
                  className="text-[#ce62f2] transition-colors duration-200"
                />
                {totalItems > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#37c3fa] to-[#ce62f2] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {totalItems > 99 ? '99+' : totalItems}
                  </div>
                )}
              </div>
            </Link>
            {isAuthenticated ? (
              <>

                <Link
                  to="/profile"
                  className="relative group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 bg-gradient-to-r from-[#37c3fa] to-[#ce62f2]  hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-95"
                >
                  <div className="relative flex items-center">
                    <User
                      size={24}
                      className="group-hover:rotate-6 transition-transform duration-200"
                    />
                  </div>
                  <span className="text-sm">Profile</span>

                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-xl -z-10" />
                </Link>

              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 flex items-center gap-1"
              >
                <User size={20} />
                <span>Login</span>
              </Link>
            )}

          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-8 w-8 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute bg-white w-full border-b">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="relative mb-3 md:hidden">
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="w-full px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute right-5 top-3 text-gray-400 h-6 w-6" />
            </form>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-indigo-600 flex items-center gap-2 w-full py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                {/* <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-indigo-600 flex items-center gap-2 w-full py-2"
                >
                  <LogOut size={20} />
                  Logout
                </button> */}
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 flex items-center gap-2 w-full py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} />
                <span>Login</span>
              </Link>
            )}
            <Link
              to="/cart"
              className="text-gray-600 hover:text-indigo-600 flex items-center gap-2 w-full py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
