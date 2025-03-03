import React, { useEffect, useState } from 'react';
import { ShoppingBag, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const updateQuantity = async (e, itemId, newQuantity) => {
        e.preventDefault();
        if (newQuantity < 1) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/cart/item/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }

            await fetchCartItems();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const removeItem = async (e, itemId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/cart/item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove item');
            }

            await fetchCartItems();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const clearCart = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/cart/clear', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to clear cart');
            }

            await fetchCartItems();
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleCartToggle = (e) => {
        e.preventDefault();
        setIsCartOpen(!isCartOpen);
    };

    const handleCheckout = () => {
        setIsCartOpen(false); // Close the cart dropdown
        navigate('/checkout'); // Navigate to checkout page
    };

    useEffect(() => {
        if (isCartOpen) {
            fetchCartItems();
        }
    }, [isCartOpen]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="relative">
            <button
                type="button"
                className="btn btn-circle btn-ghost btn-sm"
                onClick={handleCartToggle}
            >
                <ShoppingBag className="h-4 w-4" />
                {totalItems > 0 && (
                    <span className="badge badge-sm badge-primary absolute -top-2 -right-2">
                        {totalItems}
                    </span>
                )}
            </button>

            {isCartOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={handleCartToggle}
                    />

                    <div className="fixed top-0 right-0 h-full w-96 bg-base-100 shadow-xl z-50">
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Cart</h2>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-error btn-sm"
                                            onClick={clearCart}
                                            disabled={!cartItems.length}
                                        >
                                            Clear
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm"
                                            onClick={handleCartToggle}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : error ? (
                                    <div className="alert alert-error">{error}</div>
                                ) : cartItems.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="card bg-base-200">
                                                <div className="p-4">
                                                    <div className="flex gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold">
                                                                {item.product_name || 'Unnamed Product'}
                                                            </h3>
                                                            <p className="text-primary">
                                                                ${Number(item.price).toFixed(2)}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm"
                                                                    onClick={(e) => updateQuantity(e, item.id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </button>
                                                                <span className="w-8 text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm"
                                                                    onClick={(e) => updateQuantity(e, item.id, item.quantity + 1)}
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost btn-sm ml-auto"
                                                                    onClick={(e) => removeItem(e, item.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-error" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-semibold">Total Items:</span>
                                    <span>{totalItems}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-semibold">Total Price:</span>
                                    <span className="text-primary font-bold">
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary w-full"
                                    disabled={!cartItems.length || loading}
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;