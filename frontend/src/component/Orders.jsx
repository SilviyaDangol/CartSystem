import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, Package, Calendar, DollarSign } from "lucide-react";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/orders/my-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data.orders || []);
        } catch (err) {
            setError('Error loading orders');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Helper function to get status badge color
    const getStatusColor = (status) => {
        switch(status) {
            case 'pending':
                return 'badge-warning';
            case 'processing':
                return 'badge-info';
            case 'shipped':
                return 'badge-primary';
            case 'delivered':
                return 'badge-success';
            case 'cancelled':
                return 'badge-error';
            default:
                return 'badge-ghost';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="alert alert-error">
                    <AlertCircle className="h-6 w-6" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-4 text-center">
                <h2 className="text-xl font-bold mb-4">No Orders Found</h2>
                <p className="mb-4">You haven't placed any orders yet.</p>
                <Link to="/ProductListing" className="btn btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <div className="flex flex-wrap justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-lg font-bold">Order #{order.id}</h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(order.created_at)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="font-semibold">${parseFloat(order.total_amount).toFixed(2)}</span>
                                    </div>

                                    <div className={`badge ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>

                            <div className="divider my-2"></div>

                            {/* Order Items */}
                            <div className="space-y-3">
                                <h3 className="font-semibold">Items</h3>

                                <div className="overflow-x-auto">
                                    <table className="table table-compact w-full">
                                        <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {order.items && order.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.product_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${parseFloat(item.price).toFixed(2)}</td>
                                                <td>${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="divider my-2"></div>

                            {/* Shipping Information */}
                            <div className="flex flex-wrap md:flex-nowrap gap-6">
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                                    <p className="text-gray-600">{order.shipping_address}</p>
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold mb-2">Delivery Status</h3>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        <span>{order.status === 'delivered' ? 'Delivered' : 'In Progress'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;