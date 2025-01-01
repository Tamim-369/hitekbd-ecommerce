import React from 'react'

interface Order {
    _id: string;
    amountPaid: number;
    status: string;
    phoneNumber: string;
    address: string;
    transactionID: string;
}

interface OrdersProps {
    loading: boolean;
    error: string | null;
    orders: Order[];
    getStatusColor: any;
}

function Orders({ loading, error, orders, getStatusColor }: OrdersProps) {
    return (
        <>
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                        Order History
                    </h2>
                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-4">Loading orders...</div>
                        ) : error ? (
                            <div className="text-red-600 text-center py-4">{error}</div>
                        ) : orders && orders.length > 0 ? (
                            orders.map((order: Order, index: number) => {
                                index = index + 1;

                                return (
                                    <div
                                        key={order._id}
                                        className="border border-gray-200 rounded-lg p-6"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    Order # {4563 + index + order._id.toString()[0]}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Amount Paid: ৳{order.amountPaid}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status &&
                                                    order.status.charAt(0).toUpperCase() +
                                                    order.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Phone:</span>{' '}
                                                    {order.phoneNumber}
                                                </p>
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Address:</span>{' '}
                                                    {order.address}
                                                </p>
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Transaction ID:</span>{' '}
                                                    {order.transactionID}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                No orders found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Orders
