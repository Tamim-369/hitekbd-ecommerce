import { api } from '../utils/api';
import { ApiURL } from './baseApi';

export interface Product {
  _id: string;
  id: number;
  title: string;
  price: number | null;
  image: string | null;
  discountedPrice: number;
  category: string;
  brand: string | null;
  stockAmount: number;
  rating: number | null;
  details: {};
}

const getLatestProducts = async () => {
  try {
    const response = await fetch(`${ApiURL}/products?page=1&limit=8`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const allData = data.data.filter((item: Product) => item.stockAmount > 0);

    return allData;
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
};

export const getAllProducts = async (search?: string, category?: string) => {
  try {
    const response = await fetch(
      `${ApiURL}/products?page=1&limit=20${search ? `&search=${search}` : ''}${
        category ? `&category=${category}` : ''
      }`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const allData = data.data.filter((item: Product) => item.stockAmount > 0);
    return allData;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

export const allCategorys = await api.categorys.getAll();
export const allProducts = await getAllProducts();
export const featuredProducts = await getLatestProducts();
export const latestProducts = await getLatestProducts();
