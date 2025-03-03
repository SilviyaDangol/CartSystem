import React, { useState } from 'react';
import axios from 'axios';
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

const CreateCategory = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: '', message: '' });

        const trimmedName = name.trim();
        if (!trimmedName) {
            setFeedback({
                type: 'error',
                message: 'Category name cannot be empty'
            });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/categories/create',
                { name: trimmedName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            setFeedback({
                type: 'success',
                message: `Category "${trimmedName}" created successfully!`
            });
            setName('');
        } catch (err) {
            setFeedback({
                type: 'error',
                message: err.response?.data?.message || 'Failed to create category'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title flex gap-2 items-center text-2xl mb-6">
                        <Package className="w-6 h-6" />
                        Create Category
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Category Name</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter category name"
                                className="input input-bordered w-full"
                                required
                                maxLength={100}
                                disabled={loading}
                            />
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
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Category'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;