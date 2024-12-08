import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { ProductProvider } from './ProductContext';
import { ToastProvider } from './ToastContext';
import { Toaster } from 'react-hot-toast';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <ProductProvider>{children}</ProductProvider>
          <Toaster position="top-right" />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
