export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  discount?: number;
  category: string;
  brand: string;
  rating: number;
}

export const allProducts: Product[] = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80",
    discount: 20,
    category: "Electronics",
    brand: "SoundMax",
    rating: 4.5
  },
  {
    id: 2,
    title: "Smart Watch Series 5",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80",
    category: "Electronics",
    brand: "TechWatch",
    rating: 4.8
  },
  {
    id: 3,
    title: "Designer Backpack",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80",
    discount: 15,
    category: "Fashion",
    brand: "UrbanStyle",
    rating: 4.2
  },
  {
    id: 4,
    title: "Premium Sunglasses",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80",
    category: "Fashion",
    brand: "SunVogue",
    rating: 4.6
  },
  {
    id: 5,
    title: "Mechanical Keyboard",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&q=80",
    category: "Electronics",
    brand: "KeyMaster",
    rating: 4.7
  },
  {
    id: 6,
    title: "Wireless Earbuds",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80",
    discount: 10,
    category: "Electronics",
    brand: "SoundMax",
    rating: 4.4
  },
  {
    id: 7,
    title: "Smart Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&q=80",
    category: "Electronics",
    brand: "TechLife",
    rating: 4.3
  },
  {
    id: 8,
    title: "Fitness Tracker",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80",
    discount: 25,
    category: "Electronics",
    brand: "FitTech",
    rating: 4.1
  }
];

export const featuredProducts = allProducts.slice(0, 4);
export const latestProducts = allProducts.slice(4, 8);