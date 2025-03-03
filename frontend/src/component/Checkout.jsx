import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: ''
    });

    // Fetch cart items when component mounts
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/cart/my-cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            // Ensure price is converted to number
            const processedItems = (data.cartItems || []).map(item => ({
                ...item,
                price: parseFloat(item.price) || 0,
                quantity: parseInt(item.quantity) || 0
            }));
            setCartItems(processedItems);
        } catch (err) {
            setError('Error loading cart items');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const token = localStorage.getItem('token');

            // 1. Create the order
            const orderResponse = await fetch('http://localhost:5000/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
                    items: cartItems.map(item => ({
                        product_id: item.product_id,
                        product_name: item.product_name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();

            // 2. Create product sold records for each item
            for (const item of cartItems) {
                await fetch('http://localhost:5000/api/product-sold/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        product_name: item.product_name,
                        user_id: orderData.order.user_id, // Use the user ID from the order
                        quantity: item.quantity,
                        state: 'sold'
                    })
                });
            }

            // 3. Clear the cart
            await fetch('http://localhost:5000/api/cart/clear', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Set order as complete
            setOrderComplete(true);

            // Reset cart items
            setCartItems([]);

        } catch (err) {
            setError('Error processing order: ' + err.message);
            console.error('Error:', err);
        } finally {
            setProcessing(false);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // If we're still loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // If there's an error
    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="alert alert-error">
                    <AlertCircle className="h-6 w-6" />
                    <span>{error}</span>
                </div>
                <button
                    className="btn btn-primary mt-4"
                    onClick={() => navigate('/cart')}
                >
                    Return to Cart
                </button>
            </div>
        );
    }

    // If cart is empty
    if (cartItems.length === 0 && !orderComplete) {
        return (
            <div className="max-w-4xl mx-auto p-4 text-center">
                <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                <p className="mb-4">Add some products to your cart before proceeding to checkout.</p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/ProductListing')}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    // If order is complete
    if (orderComplete) {
        return (
            <div className="max-w-4xl mx-auto p-4 text-center">
                <div className="card bg-base-100 shadow-xl p-8">
                    <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
                    <p className="mb-4">Your order has been successfully placed.</p>
                    <p className="text-gray-600 mb-6">You will receive a confirmation email shortly.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/ProductListing')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    // Render checkout form
    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order summary */}
                <div className="lg:col-span-1 order-2 lg:order-1">
                    <div className="card bg-base-200 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between">
                                        <div>
                                            <span className="font-medium">{item.product_name}</span>
                                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                        </div>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="divider my-2"></div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (8%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="divider my-2"></div>
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout form */}
                <div className="lg:col-span-2 order-1 lg:order-2">
                    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Shipping Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Address</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">City</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">State</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="input input-bordered"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Zip Code</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            className="input input-bordered"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <h2 className="card-title mb-4">Payment Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text">Card Number</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        placeholder="1234 5678 9012 3456"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Expiration Date</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="cardExpiry"
                                        value={formData.cardExpiry}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        placeholder="MM/YY"
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">CVC</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="cardCvc"
                                        value={formData.cardCvc}
                                        onChange={handleInputChange}
                                        className="input input-bordered"
                                        placeholder="123"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => navigate('/cart')}
                                >
                                    Return to Cart
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : `Place Order • $${total.toFixed(2)}`}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;