import { useState, useMemo, useEffect } from 'react';
import { allCategorys, getAllProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import ProductSort from '../components/ProductSort';
import Pagination from '../components/Pagination';
import ShopProductContainer from '../components/ShopProductContainer';
import { Product } from '../utils/api';
import { Category } from '../types/category';
import SEO from '../components/SEO';
import { useSearchParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 8;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [maxPrice, setMaxPrice] = useState(0);

  const categories: Category[] = [...allCategorys];

  const getAllProductData = async () => {
    try {
      const searchTerm = searchParams.get('search') || '';
      const allProductData = await getAllProducts(searchTerm);
      setAllProducts(allProductData);

      // Calculate max price after products are loaded
      const maxPriceCount = Math.max(
        ...allProductData.map((p: Product) =>
          p.discountedPrice ? p.discountedPrice : p.price
        )
      );
      setMaxPrice(maxPriceCount);
      setPriceRange([0, maxPriceCount]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getAllProductData();
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchParams]); // Add searchParams as dependency

  // Rest of the component remains the same...
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (selectedCategory?._id) {
      filtered = filtered.filter(p => p.category === selectedCategory._id);
    }

    if (selectedBrand) {
      filtered = filtered.filter((p: any) => p.brand === selectedBrand);
    }

    filtered = filtered.filter((p: Product) => {
      const price = p.discountedPrice ?? p.price;
      return price !== null && price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a: any, b: any) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price));
        break;
      case 'price-desc':
        filtered.sort((a: any, b: any) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price));
        break;
      case 'rating':
        filtered.sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, selectedBrand, priceRange, sortBy, allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand('');
    setPriceRange([0, maxPrice]);
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Shop"
        description="Browse our wide selection of premium products at HitekBD"
      />
      <div className="lg:grid lg:grid-cols-5 lg:gap-8">
        <div className="hidden lg:block">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            priceRange={priceRange}
            maxPrice={maxPrice}
            onCategoryChange={setSelectedCategory}
            onBrandChange={setSelectedBrand}
            onPriceChange={setPriceRange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="lg:col-span-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              All Products ({filteredProducts.length})
            </h1>
            <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          {paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <ShopProductContainer>
                {paginatedProducts.map((product: any) => (
                  <ProductCard key={product._id} {...product} />
                ))}
              </ShopProductContainer>

              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}