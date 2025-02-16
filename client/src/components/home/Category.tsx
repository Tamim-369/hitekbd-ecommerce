import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { ImageURL } from '../../data/baseApi';

// Types
interface CategoryType {
    _id: string;
    name: string;
    image: string;
}

// Category Card Component
const CategoryCard: React.FC<{
    category: CategoryType;
}> = ({ category }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/shop?category=${category._id}`)}
            className="group relative flex flex-col items-center pt-20 sm:pt-24 pb-6 px-4 bg-gray-100/80 backdrop-blur-sm rounded-xl transition-all duration-300 hover:cursor-pointer hover:shadow-xl hover:shadow-[#37c3fa]/10 hover:-translate-y-1"
        >
            {/* Image Container */}
            <div className="absolute -top-8 sm:-top-12 transition-transform duration-300 group-hover:scale-110">
                <div className="relative">
                    {/* Gradient ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#37c3fa] to-[#ce62f2] p-1 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Image */}
                    <div className="relative rounded-full p-1 bg-gradient-to-r from-[#37c3fa] to-[#ce62f2]">
                        <img
                            src={`${ImageURL}/${category.image}`}
                            alt={category.name}
                            className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-full bg-white transform transition-transform duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Category Name */}
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mt-4 uppercase tracking-wide text-center transition-colors duration-300 group-hover:text-white  group-hover:text-transparent">
                {category.name}
            </h3>

            {/* Hover gradient border */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#37c3fa] to-[#ce62f2] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur" />
        </div>
    );
};

// Main Category Component
const Category: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const navigate = useNavigate();

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.categorys.getAll();
            setCategories(response);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            // You might want to add error handling UI here
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="relative max-w-screen-2xl mx-auto px-4 py-12 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-[#37c3fa]/10 to-[#ce62f2]/10 rounded-full filter blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-r from-[#ce62f2]/10 to-[#37c3fa]/10 rounded-full filter blur-3xl -z-10" />

            {/* Section header */}
            <div className="relative mb-12">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#37c3fa] to-[#ce62f2] bg-clip-text text-transparent inline-block">
                    Featured Categories
                </h1>
                <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-[#37c3fa] to-[#ce62f2]" />
            </div>

            {/* Categories grid */}
            <div className="grid grid-cols-2 min-w-[480px]:grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 min-w-[630px]:mx-10">
                {categories
                    .filter(category => category.image)
                    .map((category) => (
                        <CategoryCard
                            key={category._id}
                            category={category}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Category;