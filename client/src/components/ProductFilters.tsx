import { SlidersHorizontal } from 'lucide-react';

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  selectedCategory: string;
  selectedBrand: string;
  priceRange: [number, number];
  maxPrice: number;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  priceRange,
  maxPrice,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onClearFilters,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          Clear all filters
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="all-categories"
              type="radio"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => onCategoryChange('')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="all-categories" className="ml-2 text-gray-700">
              All Categories
            </label>
          </div>
          {categories.map(category => (
            <div key={category} className="flex items-center">
              <input
                id={category}
                type="radio"
                name="category"
                checked={selectedCategory === category}
                onChange={() => onCategoryChange(category)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor={category} className="ml-2 text-gray-700">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="all-brands"
              type="radio"
              name="brand"
              checked={selectedBrand === ''}
              onChange={() => onBrandChange('')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="all-brands" className="ml-2 text-gray-700">
              All Brands
            </label>
          </div>
          {brands.map(brand => (
            <div key={brand} className="flex items-center">
              <input
                id={brand}
                type="radio"
                name="brand"
                checked={selectedBrand === brand}
                onChange={() => onBrandChange(brand)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor={brand} className="ml-2 text-gray-700">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">${priceRange[0]}</span>
            <span className="text-sm text-gray-600">${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceRange[1]}
            onChange={e =>
              onPriceChange([priceRange[0], Number(e.target.value)])
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
