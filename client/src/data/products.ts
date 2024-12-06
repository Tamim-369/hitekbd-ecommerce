export interface Product {
  id: number;
  title: string;
  price: number | null;
  image: string | null;
  discount?: number;
  category: string;
  brand: string | null;
  rating: number | null;
  details: {};
}

export const allProducts: Product[] = [
  {
    id: 1,
    title: 'Cristal Galaxy Ball',
    price: 895,
    image: '',
    category: 'Lighting',
    brand: null,
    rating: null,
    details: {
      baseMaterial: 'Wood',
      dimensions: '0.5"D x 0.3"W x 0.9"H',
      lampType: 'LED',
      shadeColor: 'Multicolor',
      shadeMaterial: 'Glass, Wood',
      warranty: '7 Days',
      returnPolicy: 'Damaged product cannot be returned',
    },
  },
];

export const featuredProducts = allProducts.slice(0, 5);
export const latestProducts = allProducts.slice(4, 9);
