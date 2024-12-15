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
    return data.data;
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
};

const getAllProducts = async () => {
  try {
    const response = await fetch(`${ApiURL}/products?page=1&limit=20`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};
export const allCategorys = await api.categorys.getAll();
export const allProducts = await getAllProducts();
export const featuredProducts = await getLatestProducts();
export const latestProducts = await getLatestProducts();
