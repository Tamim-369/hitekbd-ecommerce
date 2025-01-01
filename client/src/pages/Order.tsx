import { jwtDecode } from 'jwt-decode'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api'

function Order() {
    const { id } = useParams()
    if (!id) window.location.href = '/profile'
    useEffect(() => {
        const checkUser = async () => {
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

                    const order: any = await api.orders.getById(id!)
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
    return (
        <div>

        </div>
    )
}

export default Order
