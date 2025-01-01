import { useState, useMemo } from 'react';
import { allCategorys, allProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import ProductSort from '../components/ProductSort';
import Pagination from '../components/Pagination';
import ShopProductContainer from '../components/ShopProductContainer';
import { Category, Product } from '../utils/api';
import SEO from '../components/SEO';

const ITEMS_PER_PAGE = 8;

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique categories and brands
  const categories: Category[] = [...allCategorys];
  const maxPrice = Math.max(...allProducts.map((p: Product) => p.price));

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Apply category filter - only filter if a category is selected
    if (selectedCategory?._id) {
      filtered = filtered.filter(p => p.category === selectedCategory._id);
    }
    // If selectedCategory is null, show all products

    // Apply brand filter
    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Apply price range filter
    filtered = filtered.filter(
      (p: Product) =>
        p.discountedPrice &&
        Number(p.discountedPrice) >= priceRange[0] &&
        Number(p.discountedPrice) <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    return filtered;
  }, [selectedCategory, selectedBrand, priceRange, sortBy]);

  // Calculate pagination
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
        {/* Filters - Left Sidebar */}
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

        {/* Product Grid */}
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
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
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
