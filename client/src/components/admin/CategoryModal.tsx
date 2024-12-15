import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Category } from '../../utils/api';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../utils/api';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categories,
}: CategoryModalProps) {
  const [newCategory, setNewCategory] = useState('');
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.categorys.create({ name: newCategory });
      showSuccess('Category added successfully');
      setNewCategory('');
      onSuccess();
    } catch (error) {
      showError('Failed to add category');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.categorys.delete(id);
      showSuccess('Category deleted successfully');
      onSuccess();
    } catch (error) {
      showError('Failed to delete category');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Manage Categories</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Add New Category Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="flex-1 p-2 rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </form>

        {/* Categories List */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 mb-3">Current Categories</h3>
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <span>{category.name}</span>
              <button
                onClick={() => handleDelete(category._id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 