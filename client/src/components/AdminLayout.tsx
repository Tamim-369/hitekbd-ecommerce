import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function AdminLayout() {
  const [user, setUser] = useState<any>();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken: any = jwtDecode(token!);
    setUser(decodedToken);
    if (decodedToken.role !== 'admin') {
      window.location.href = '/login';
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-grow">
        {user && user.role === 'admin' && <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
