import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { ToastProvider } from './ToastContext';
import { Toaster } from 'react-hot-toast';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          {children}
          <Toaster position="top-right" />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}