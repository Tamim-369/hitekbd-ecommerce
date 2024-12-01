import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-5 h-5 text-gray-500" />
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
}