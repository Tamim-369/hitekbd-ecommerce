import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard'
    },
    {
      path: '/admin/products',
      icon: <ShoppingBag size={20} />,
      label: 'Products'
    },
    {
      path: '/admin/users',
      icon: <Users size={20} />,
      label: 'Users'
    },
    {
      path: '/admin/settings',
      icon: <Settings size={20} />,
      label: 'Settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-10
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100
                ${location.pathname === item.path ? 'bg-gray-100 text-indigo-600' : ''}
              `}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={`
        transition-all duration-200 ease-in-out
        ${isSidebarOpen ? 'lg:ml-64' : ''}
      `}>
        <div className="min-h-screen bg-gray-100 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 