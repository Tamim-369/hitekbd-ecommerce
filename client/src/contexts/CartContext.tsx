import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  _id: string;
  title: string;
  price: number;
  image: string[];
  quantity: number;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (_id: string) => void;
  updateQuantity: (_id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (_id: string) => boolean;
  getItemQuantity: (_id: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item._id === product._id);
      if (existingItem) {
        return currentItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (_id: string) => {
    setItems(items => items.filter(item => item._id !== _id));
  };
  const getItemQuantity = (_id: string) => {
    return items.find(item => item._id === _id)?.quantity || 0;
  }
  const updateQuantity = (_id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems(items =>
      items.map(item => (item._id === _id ? { ...item, quantity } : item))
    );
  };
  const isInCart = (_id: string) => items.some(item => item._id === _id);
  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        isInCart,
        totalPrice,
        getItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
