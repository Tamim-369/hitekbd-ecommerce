import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { api, Product } from '../utils/api';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  loadProducts: () => Promise<Product[]>;
  getProduct: (id: string) => Promise<Product>;
  createProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: string, formData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (currentPage = 1
    , itemsPerPage = 20): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.products.getAll({ page: currentPage, limit: itemsPerPage });
      console.log('Loaded products:', data);
      setProducts(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduct = async (id: string): Promise<Product> => {
    try {
      return await api.products.getById(id);
    } catch (err) {
      throw new Error('Failed to load product');
    }
  };

  const createProduct = async (formData: FormData) => {
    try {
      await api.products.create(formData);
      await loadProducts(); // Refresh the products list
    } catch (err) {
      throw new Error('Failed to create product');
    }
  };

  const updateProduct = async (id: string, formData: FormData) => {
    try {
      await api.products.update(id, formData);
      await loadProducts(); // Refresh the products list
    } catch (err) {
      throw new Error('Failed to update product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.products.delete(id);
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      throw new Error('Failed to delete product');
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        loadProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
