import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';// Update with your actual api import path
import toast from 'react-hot-toast';
import Input from '../Input';

function Coupons() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '', discountPrice: '' });
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Fetch all coupons on component mount
    useEffect(() => {
        fetchCoupons();
    }, []);

    // Fetch coupons from API
    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const data = await api.coupon.getAll();
            setCoupons(data);
        } catch (error) {
            showToast('Failed to fetch coupons', true);
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCoupon) {
                // Update existing coupon
                await api.coupon.update(formData, editingCoupon._id);
                showToast('Coupon updated successfully');
            } else {
                // Create new coupon
                await api.coupon.create(formData);
                showToast('Coupon created successfully');
            }
            // Reset form and close modal
            setFormData({ name: '', discountPrice: '' });
            setModalVisible(false);
            setEditingCoupon(null);
            // Refresh coupons list
            fetchCoupons();
        } catch (error) {
            showToast('Operation failed', true);
            console.error('Error submitting coupon:', error);
        }
    };

    // Handle edit coupon
    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            name: coupon.name,
            discountPrice: coupon.discountPrice,
        });
        setModalVisible(true);
    };

    // Handle delete coupon
    const handleDelete = async (id) => {
        try {
            await api.coupon.delete(id);
            showToast('Coupon deleted successfully');
            setConfirmDelete(null);
            fetchCoupons();
        } catch (error) {
            showToast('Failed to delete coupon', true);
            console.error('Error deleting coupon:', error);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Show toast notification
    const showToast = (message, isError = false) => {

        toast.success(message);
    };

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Coupons Management</h1>
                <button
                    onClick={() => {
                        setEditingCoupon(null);
                        setFormData({ name: '', discountPrice: '' });
                        setModalVisible(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Coupon
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No coupons found
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coupon.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{coupon.discountPrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(coupon.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete(coupon._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {modalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
                                </h3>
                                <button
                                    onClick={() => setModalVisible(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Coupon Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter coupon name"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount Price
                                    </label>
                                    <Input
                                        id="description"
                                        name="discountPrice"
                                        value={formData.discountPrice}
                                        onChange={handleChange}
                                        type="number"
                                        required
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter coupon Price"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setModalVisible(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        {editingCoupon ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Confirmation</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete this coupon? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Coupons;