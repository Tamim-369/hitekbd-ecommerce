import React, { useState } from 'react';
import { X, Plus, Upload, PencilIcon, CheckIcon } from 'lucide-react';
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
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    image: File | null;
    imagePreview: string | null;
  }>({
    name: '',
    image: null,
    imagePreview: null
  });

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory(prev => ({ ...prev, image: file }));
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ ...prev, image: file }));
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, imagePreview: reader.result }));
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

  const handleUpdate = async (id: string) => {
    try {
      const formData: any = new FormData();
      formData.append('name', editForm.name);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      await api.categorys.update(formData, id);
      onSuccess();
      setEditingCategory(null);
      setEditForm({ name: '', image: null, imagePreview: null });
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category._id);
    setEditForm({
      name: category.name,
      image: null,
      imagePreview: category.image ? `${ImageURL}/${category.image}` : null
    });
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
        {/* Header section remains the same */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Manage Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Add new category form remains the same */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... existing form code ... */}
        </form>

        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-gray-900">Current Categories</h3>
          <div className="space-y-2 h-64 overflow-y-auto border rounded-lg p-1">
            {categories.map((category: Category) => (
              <div
                key={category._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                {editingCategory === category._id ? (
                  // Edit mode
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative">
                      {editForm.imagePreview ? (
                        <img
                          src={editForm.imagePreview}
                          alt={category.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <img
                          src={`${ImageURL}/${category.image}`}
                          alt={category.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <label
                        htmlFor={`edit-image-${category._id}`}
                        className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow cursor-pointer"
                      >
                        <Upload className="h-3 w-3 text-gray-500" />
                      </label>
                      <input
                        id={`edit-image-${category._id}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleEditImageChange}
                      />
                    </div>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="flex-1 px-2 py-1 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdate(category._id)}
                      className="p-1 text-green-600 hover:text-green-700"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  // View mode
                  <>
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(category)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category._id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;