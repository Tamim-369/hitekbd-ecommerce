import React, { useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';
import { api } from '../../utils/api';
import { ImageURL } from '../../data/baseApi';
import { Category } from '../../types/category';
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}
const CategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  categories
}: CategoryModalProps) => {
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory(prev => ({ ...prev, image: file }));
      // Create preview URL for the selected image
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }

      await api.categorys.create(formData);
      onSuccess();
      setNewCategory({ name: '', image: null });
      setImagePreview(null);
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.categorys.delete(id);
      onSuccess();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Manage Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              id="name"
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Category Image
            </label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview && (
                <div className="relative w-32 h-32">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    onClick={() => {
                      setImagePreview(null);
                      setNewCategory(prev => ({ ...prev, image: null }));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Adding...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </div>
            )}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-gray-900">Current Categories</h3>
          <div className="space-y-2">
            {categories.map((category: any) => (
              <div
                key={category._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {category.image && (
                    <img
                      src={`${ImageURL}/${category.image}`}
                      alt={category.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium">{category.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(category._id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;