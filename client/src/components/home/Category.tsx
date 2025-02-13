import React, { useState } from 'react'
import { api } from '../../utils/api'
import { ImageURL } from '../../data/baseApi'
import { useNavigate } from 'react-router-dom'

const Category = () => {
    const [category, setCategory] = useState<Array<any>>([])
    const fetchCategory = React.useCallback(async () => {
        const response = await api.categorys.getAll()
        setCategory(response)
    }, [])

    React.useEffect(() => {
        fetchCategory()
    }, [fetchCategory])
    const navigate = useNavigate()
    return (
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Featured Categories</h1>
            <div className="grid grid-cols-3  sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 content-center items-center gap-6 min-w-[630px]:mx-10">
                {category.filter(c => c.image).map((category) => (
                    <div key={category.name} onClick={() => navigate(`/shop?category=${category._id}`)} className="relative mt-5  flex flex-col items-center pt-24 pb-6 px-4 bg-gray-200 rounded-lg hover:cursor-pointer">
                        <div className="absolute min-w-[630px]:-top-16 -top-8">
                            <img
                                src={`${ImageURL}/${category.image}`}
                                alt={category.name}
                                className="sm:h-32 sm:w-32 min-w-[480px]:h-28 min-w-[480px]:w-28 w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                            />
                        </div>
                        <h3 className="text-sm sm:text-base min-w-[630px]:text-lg font-semibold text-gray-900 mt-2">
                            {category.name}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Category

