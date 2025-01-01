import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api'
import { ImageURL } from '../data/baseApi'

function Order() {
    const { id } = useParams()
    const [order, setOrder] = useState<any>(null)
    if (!id) window.location.href = '/profile'

    useEffect(() => {
        if (!localStorage.getItem('token')) window.location.href = '/login'
        const checkUser = async () => {
            const isExistOrder = await api.orders.getById(id as string)
            if (!isExistOrder) {
                window.location.href = '/profile'
                return;
            }
            setOrder(isExistOrder)
            const token = localStorage.getItem('token')
            if (!token) {
                window.location.href = '/login'
                return
            }

            const user: any = jwtDecode(token)
            if (!user) {
                window.location.href = '/login'
                return
            }

            if (user.role !== 'ADMIN' && user.role === 'USER') {
                try {
                    if (order.data.user !== user.id) {
                        window.location.href = '/profile'
                    }
                } catch (error) {
                    console.error('Failed to fetch order:', error)
                    window.location.href = '/profile'
                }
            }
        }

        checkUser()
    }, [id])

    if (!order) return null

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <h2 className="text-3xl font-bold mb-8 ">Order Details</h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-[#37acfa]">Order Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">Order ID: <span className="font-semibold">{order._id}</span></p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-[#37acfa]">Customer Details</h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p className="text-gray-700">Name: <span className="font-semibold">{order.user.name}</span></p>
                                    <p className="text-gray-700">Email: <span className="font-semibold">{order.user.email}</span></p>
                                    <p className="text-gray-700">Phone: <span className="font-semibold">{order.phoneNumber}</span></p>
                                    <p className="text-gray-700">Address: <span className="font-semibold">{order.address}</span></p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-[#37acfa]">Ordered Items</h3>
                                <div className="space-y-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.productId} className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row items-center">
                                            <img
                                                src={`${ImageURL}/${item.image}`}
                                                alt={item.title}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <p className="text-gray-700">Price: <span className="font-semibold">৳{item.price}</span></p>
                                                    <p className="text-gray-700">Quantity: <span className="font-semibold">{item.quantity}</span></p>
                                                    {item.color && (
                                                        <div className="flex items-center">
                                                            <span className="text-gray-700 mr-2">Color:</span>
                                                            <div
                                                                className="w-6 h-6 rounded-full border border-gray-200"
                                                                style={{ backgroundColor: item.color }}
                                                                title={item.color}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-[#37acfa]">Payment Details</h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p className="text-gray-700">Amount Paid: <span className="font-semibold">৳{order.amountPaid}</span></p>
                                    <p className="text-gray-700">Transaction ID: <span className="font-semibold">{order.transactionID}</span></p>
                                    <p className="text-gray-700">Status: <span className="font-semibold uppercase tracking-wider text-[#c937fb]">{order.status}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order