import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { api } from '../../utils/api';
import { ImageURL } from '../../data/baseApi';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const fetchBanners = async () => {
        try {
            const response: any = await api.banners.getAll();
            setBanners(response);
        } catch (error) {
            console.error('Error fetching banners:', error);
            setError('Failed to fetch banners. Please try again.');
        }
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setSelectedFile(file);
            setError('');
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            await api.banners.create(formData);
            await fetchBanners();
            resetForm();
        } catch (error: any) {
            console.error('Error saving banner:', error);
            setError(error.message || 'Failed to upload banner. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: any) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await api.banners.delete(id);
                await fetchBanners();
            } catch (error) {
                console.error('Error deleting banner:', error);
                setError('Failed to delete banner. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setError('');
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl('');
        }
        setIsCreateOpen(false);
    };

    const Modal = ({ isOpen, onClose, title, children }: any) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg w-full max-w-md">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded"
                            disabled={isUploading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    const BannerForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium">Banner Image</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    name="image"
                    accept="image/*"
                    className="w-full p-2 border rounded"
                    required={selectedFile ? false : true}
                    disabled={isUploading}
                />
                {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
                {previewUrl && (
                    <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg"
                        />
                    </div>
                )}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                    disabled={isUploading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Upload Banner'}
                </button>
            </div>
        </form>
    );

    return (
        <div className="p-6">
            <div className="bg-white rounded-lg shadow">
                <div className="flex justify-between items-center p-4 border-b">
                    <h1 className="text-2xl font-semibold">Banner Management</h1>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Banner</span>
                    </button>
                </div>
                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {banners.map((banner: any) => (
                        <div key={banner._id} className="relative group">
                            <img
                                src={`${ImageURL}/${banner.image}`}
                                alt="Banner"
                                className="w-full h-40 object-cover rounded-lg"
                            />
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(banner._id)}
                                    className="p-2 bg-white rounded-full hover:bg-gray-100 shadow"
                                    title="Delete banner"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isCreateOpen}
                onClose={resetForm}
                title="Upload New Banner"
            >
                <BannerForm />
            </Modal>
        </div>
    );
};

export default Banners;