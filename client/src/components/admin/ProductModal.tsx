import { useState, useEffect } from 'react';
import { X, Upload, Plus, Minus, GripVertical } from 'lucide-react';
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

interface ImageItem {
  url: string;
  file?: File;
  order: number;
}

interface ColorVariant {
  color: string;
  amount: number;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<any>>({
    title: '',
    description: '',
    price: null,
    discountedPrice: null,
    category: '',
    stockAmount: null,
    image: [],
    details: [],
    colors: []
  });

  const [images, setImages] = useState<ImageItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const { createProduct, updateProduct } = useProducts();
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
      const existingImages = product.image.map((img, index) => ({
        url: `${ImageURL}/${img}`,
        order: index,
      }));
      setImages(existingImages);
    } else {
      setFormData({
        title: '',
        description: '',
        price: null,
        discountedPrice: null,
        category: '',
        stockAmount: null,
        colors: [
          {
            color: '#000000',
            amount: 0
          }
        ],
        image: [],
        details: []
      });
      setImages([]);
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
      const newImages = Array.from(files).map((file, index) => ({
        url: URL.createObjectURL(file),
        file: file,
        order: images.length + index,
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const items = [...images];
    const draggedItemContent = items[draggedItem];

    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemContent);

    const reorderedItems = items.map((item, idx) => ({
      ...item,
      order: idx,
    }));

    setImages(reorderedItems);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, idx) => idx !== index).map((img, idx) => ({
      ...img,
      order: idx,
    }));
    setImages(newImages);
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
      details: prev.details?.filter((_: any, i: any) => i !== index)
    }));
  };

  const handleDetailChange = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details?.map((detail: any, i: any) =>
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();

      // Basic fields
      form.append('title', formData.title || '');
      form.append('description', formData.description || '');
      form.append('price', String(formData.price || 0));
      form.append('discountedPrice', String(formData.discountedPrice || 0));
      form.append('category', formData.category || '');
      form.append('stockAmount', String(formData.stockAmount || 0));
      form.append('colors', JSON.stringify(formData.colors || []));
      form.append('details', JSON.stringify(formData.details || []));

      // Handle images
      const orderedImages = [...images].sort((a, b) => a.order - b.order);

      if (product) {
        // Update existing product
        const existingImages = orderedImages
          .filter(img => !img.file)
          .map(img => img.url.replace(`${ImageURL}/`, ''));

        const newFiles = orderedImages
          .filter(img => img.file)
          .map(img => img.file);

        form.append('existingImages', JSON.stringify(existingImages));
        newFiles.forEach(file => {
          if (file) form.append('image', file);
        });

        await updateProduct(product._id, form);
        showSuccess('Product updated successfully');
      } else {
        // Create new product
        orderedImages.forEach(img => {
          if (img.file) form.append('image', img.file);
        });

        await createProduct(form);
        showSuccess('Product created successfully');
      }

      onSuccess();
      onClose();
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
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all duration-200"
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

            {/* Image Preview and Ordering */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Drag images to reorder. First image will be the main product image.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className="relative group border border-gray-200 rounded-lg p-2 cursor-move"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <GripVertical className="text-gray-400" size={16} />
                        <span className="text-sm text-gray-500">Position: {image.order + 1}</span>
                      </div>
                      <img
                        src={image.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color Variants */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Color Variants</label>
              <button
                type="button"
                onClick={() => setFormData((prev: any) => ({
                  ...prev,
                  colors: [...(prev.colors || []), { color: '#000000', amount: 0 }]
                }))}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus size={16} className="mr-1" />
                Add Color
              </button>
            </div>
            <div className="space-y-3">
              {formData.colors?.map((colorObj, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: colorObj.color }}
                      onClick={() => document.getElementById(`color-picker-${index}`)?.click()}
                    />
                    <input
                      id={`color-picker-${index}`}
                      type="color"
                      value={colorObj.color}
                      onChange={(e) => {
                        const newColors = [...(formData.colors || [])];
                        newColors[index] = { ...colorObj, color: e.target.value };
                        setFormData({ ...formData, colors: newColors });
                      }}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-700">{colorObj.color}</span>
                    <input
                      type="number"
                      value={colorObj.amount}
                      onChange={(e) => {
                        const newColors = [...(formData.colors || [])];
                        newColors[index] = { ...colorObj, amount: Number(e.target.value) };
                        setFormData({ ...formData, colors: newColors });
                      }}
                      placeholder="Amount"
                      className="w-24 p-1 focus:outline-none text-sm text-gray-700 border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-0 focus:bg-white transition-all rounded-md duration-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newColors = formData.colors?.filter((_, i) => i !== index);
                      setFormData({ ...formData, colors: newColors });
                    }}
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

          {/* Form Actions */}
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