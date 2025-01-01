import { useState, useEffect } from 'react';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { Product } from '../../utils/api';
import { Category } from '../../types/category';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { ImageURL } from '../../data/baseApi';
import { api } from '../../utils/api';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

interface ProductDetail {
  name: string;
  value: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: null,
    discountedPrice: null,
    category: '',
    stockAmount: null,
    image: [],
    details: []
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { createProduct, updateProduct } = useProducts();
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setPreviewUrls(product.image.map(img => `${ImageURL}/${img}`));
    } else {
      setFormData({
        title: '',
        description: '',
        price: null,
        discountedPrice: null,
        category: '',
        stockAmount: null,
        colors: [],
        image: [],
        details: []
      });
      setPreviewUrls([]);
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.categorys.getAll();
        setCategories(data);
      } catch (error) {
        showError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files);
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleAddDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...(prev.details || []), { name: '', value: '' }]
    }));
  };

  const handleRemoveDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details?.filter((_, i) => i !== index)
    }));
  };

  const handleDetailChange = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details?.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();

      if (product) {
        // For update, send all fields
        form.append('title', formData.title || '');
        form.append('description', formData.description || '');
        form.append('price', String(formData.price || 0));
        form.append('discountedPrice', String(formData.discountedPrice || 0));
        form.append('category', formData.category || '');
        form.append('stockAmount', String(formData.stockAmount || 0));
        form.append('colors', JSON.stringify(formData.colors || []));

        // Always send the complete details array
        const details = formData.details || [];
        form.append('details', JSON.stringify(details));

        // Only append new images if they are selected
        if (selectedFiles && selectedFiles.length > 0) {
          Array.from(selectedFiles).forEach(file => {
            form.append('image', file);
          });
        } else {
          // If no new images, send the existing image array
          form.append('image', JSON.stringify(formData.image));
        }

        await updateProduct(product._id, form);
        showSuccess('Product updated successfully');
      } else {
        // For create, send all fields
        form.append('title', formData.title || '');
        form.append('description', formData.description || '');
        form.append('price', String(formData.price || 0));
        form.append('discountedPrice', String(formData.discountedPrice || 0));
        form.append('category', formData.category || '');
        form.append('stockAmount', String(formData.stockAmount || 0));
        form.append('colors', JSON.stringify(formData.colors || []));

        // Convert details array to JSON string
        const detailsString = JSON.stringify(formData.details || []);
        form.append('details', detailsString);

        // Append images
        if (selectedFiles) {
          Array.from(selectedFiles).forEach(file => {
            form.append('image', file);
          });
        }

        await createProduct(form);
        showSuccess('Product created successfully');
      }

      onSuccess();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      showError(product ? 'Failed to update product' : 'Failed to create product');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
              required
            />
          </div>

          {/* Pricing and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Discounted Price</label>
              <input
                type="number"
                value={formData.discountedPrice || ''}
                onChange={(e) => setFormData({ ...formData, discountedPrice: Number(e.target.value) })}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Amount</label>
              <input
                type="number"
                value={formData.stockAmount || ''}
                onChange={(e) => setFormData({ ...formData, stockAmount: Number(e.target.value) })}
                className="mt-1 p-2  block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="sr-only"
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {previewUrls.length > 0 && (
              <div className="mt-4 flex gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Color Variants */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Color Variants</label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  colors: [...(prev.colors || []), '#000000']
                }))}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus size={16} className="mr-1" />
                Add Color
              </button>
            </div>
            <div className="space-y-3">
              {formData.colors?.map((color, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => document.getElementById(`color-picker-${index}`)?.click()}
                    />
                    <input
                      id={`color-picker-${index}`}
                      type="color"
                      value={color}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        colors: prev.colors?.map((c, i) => i === index ? e.target.value : c)
                      }))}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-700">{color}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      colors: prev.colors?.filter((_, i) => i !== index)
                    }))}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Product Details */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Product Details</label>
              <button
                type="button"
                onClick={handleAddDetail}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus size={16} className="mr-1" />
                Add Detail
              </button>
            </div>
            <div className="space-y-3">
              {formData.details?.map((detail, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="text"
                    value={detail.name}
                    onChange={(e) => handleDetailChange(index, 'name', e.target.value)}
                    placeholder="Name"
                    className="flex-1 p-2 rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
                  />
                  <input
                    type="text"
                    value={detail.value}
                    onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 p-2 rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 