import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { api, Product } from '../../utils/api';
import { Category } from '../../types/category';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import ProductModal from '../../components/admin/ProductModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { DashboardSkeleton } from '../../components/admin/DashboardSkeleton';
import { ImageURL } from '../../data/baseApi';
import CategoryModal from '../../components/admin/CategoryModal';

export default function AdminProducts() {
  const { products, loading, loadProducts } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSuccess, showError } = useToast();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  useEffect(() => {
    loadProducts(currentPage, itemsPerPage);
    fetchCategories();
  }, [currentPage, itemsPerPage, loadProducts]);

  const fetchCategories = async () => {
    try {
      const data = await api.categorys.getAll();
      setCategories(data);
    } catch (error) {
      showError('Failed to load categories');
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await api.products.delete(selectedProduct._id);
      showSuccess('Product deleted successfully');
      loadProducts(currentPage, itemsPerPage);
      setIsDeleteModalOpen(false);
    } catch (error) {
      showError('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
          >
            Manage Categories
          </button>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="button-gradient px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <img
              src={`${ImageURL}/${product.image[0]}`}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {product.title}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {product.description.slice(0, 100)}...
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    ৳{product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.stockAmount}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={filteredProducts.length < itemsPerPage}
            className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          setIsModalOpen(false);
          loadProducts(currentPage, itemsPerPage);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />

      {/* Add CategoryModal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={fetchCategories}
        categories={categories}
      />
    </div>
  );
}