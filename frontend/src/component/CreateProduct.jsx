import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Image as ImageIcon, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

const CreateProduct = () => {
    const [productData, setProductData] = useState({
        product_name: '',
        category_id: '',
        quantity: '',
        price: '',
        image: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [categories, setCategories] = useState([]);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories/all');
                setCategories(response.data.categories || []);
                setLoading(false);
            } catch (err) {
                setFeedback({
                    type: 'error',
                    message: `Failed to fetch categories: ${err.response?.data?.message || err.message}`
                });
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductData({ ...productData, image: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedback({ type: '', message: '' });

        if (!productData.category_id) {
            setFeedback({ type: 'error', message: 'Please select a category' });
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('product_name', productData.product_name);
        formData.append('category_id', productData.category_id);
        formData.append('quantity', productData.quantity);
        formData.append('price', productData.price);
        if (productData.image) formData.append('image', productData.image);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/products/create',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setFeedback({
                type: 'success',
                message: `Product "${productData.product_name}" created successfully!`
            });

            // Reset form
            setProductData({
                product_name: '',
                category_id: '',
                quantity: '',
                price: '',
                image: null
            });
            setPreviewUrl(null);
        } catch (err) {
            setFeedback({
                type: 'error',
                message: err.response?.data?.message || 'Failed to create product'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title flex gap-2 items-center text-2xl mb-6">
                        <Package className="w-6 h-6" />
                        Create Product
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Name</span>
                            </label>
                            <input
                                type="text"
                                value={productData.product_name}
                                onChange={(e) => setProductData({ ...productData, product_name: e.target.value })}
                                placeholder="Enter product name"
                                className="input input-bordered w-full"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select
                                value={productData.category_id}
                                onChange={(e) => setProductData({ ...productData, category_id: e.target.value })}
                                className="select select-bordered w-full"
                                required
                                disabled={submitting}
                            >
                                <option value="">Select a Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Quantity</span>
                                </label>
                                <input
                                    type="number"
                                    value={productData.quantity}
                                    onChange={(e) => setProductData({ ...productData, quantity: e.target.value })}
                                    placeholder="Enter quantity"
                                    className="input input-bordered w-full"
                                    required
                                    min="1"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Price</span>
                                </label>
                                <input
                                    type="number"
                                    value={productData.price}
                                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                                    placeholder="Enter price"
                                    className="input input-bordered w-full"
                                    required
                                    min="0"
                                    step="0.01"
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Product Image</span>
                            </label>
                            <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg">
                                {previewUrl ? (
                                    <div className="relative">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-h-48 rounded-lg object-contain"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-circle btn-sm absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
                                            onClick={() => {
                                                setPreviewUrl(null);
                                                setProductData({ ...productData, image: null });
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-base-content/60">
                                        <ImageIcon className="w-12 h-12" />
                                        <p>Drag and drop or click to upload</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="file-input file-input-bordered w-full"
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        {feedback.message && (
                            <div className={`alert ${
                                feedback.type === 'error' ? 'alert-error' : 'alert-success'
                            } flex items-center gap-2`}>
                                {feedback.type === 'error' ? (
                                    <AlertTriangle className="w-5 h-5" />
                                ) : (
                                    <CheckCircle2 className="w-5 h-5" />
                                )}
                                <span>{feedback.message}</span>
                            </div>
                        )}

                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                className={`btn btn-primary ${submitting ? 'loading' : ''}`}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Product'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;