import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [notification, setNotification] = useState(null);

    const updateQuantity = (productId, change) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 0) + change)
        }));
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddToCart = async (product) => {
        const quantity = quantities[product.id] || 0;
        if (quantity > 0) {
            try {
                const response = await fetch('http://localhost:5000/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        product_id: product.id,
                        quantity: quantity
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to add to cart');
                }

                const data = await response.json();
                showNotification(`Added ${quantity} of ${product.product_name} to cart`);
                setQuantities(prev => ({
                    ...prev,
                    [product.id]: 0
                }));
            } catch (err) {
                showNotification(err.message, 'error');
            }
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/all');
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {notification && (
                <div className={`alert ${notification.type === 'error' ? 'alert-error' : 'alert-success'} mb-4`}>
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Our Products</h1>
                <div className="join">
                    <button className="btn btn-sm join-item">Newest</button>
                    <button className="btn btn-sm join-item btn-active">Popular</button>
                    <button className="btn btn-sm join-item">Trending</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                        <figure className="relative">
                            <img
                                src={product.image
                                    ? `http://localhost:5000/uploads/${product.image}`
                                    : "/api/placeholder/300/300"
                                }
                                alt={product.product_name}
                                className="w-full aspect-square object-cover"
                                onError={(e) => {
                                    e.target.src = "/api/placeholder/300/300";
                                }}
                            />
                            {product.discount > 0 && (
                                <div className="badge badge-secondary absolute top-2 left-2">
                                    -{product.discount}%
                                </div>
                            )}
                        </figure>

                        <div className="card-body p-4">
                            <div className="badge badge-ghost">{product.category_name}</div>
                            <h3 className="card-title text-lg">{product.product_name}</h3>
                            <p className="text-xl font-bold text-primary">${product.price}</p>

                            <div className="flex items-center gap-2 mt-4">
                                <div className="join">
                                    <button
                                        className="btn btn-sm join-item"
                                        onClick={() => updateQuantity(product.id, -1)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="btn btn-sm join-item no-animation">
                                        {quantities[product.id] || 0}
                                    </span>
                                    <button
                                        className="btn btn-sm join-item"
                                        onClick={() => updateQuantity(product.id, 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    className="btn btn-primary btn-sm flex-1"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={!quantities[product.id]}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductListing;