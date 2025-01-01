import ProductCard from '../../components/ProductCard';

interface WishListProps {
    wishlistLoading: boolean;
    wishlistItems: Array<any>;
}

function WishList({ wishlistLoading, wishlistItems }: WishListProps) {
    return (
        <>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
                {wishlistLoading ? (
                    <div className="text-center py-8">Loading wishlist...</div>
                ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Your wishlist is empty
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => (
                            <ProductCard key={item._id} {...item} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default WishList
