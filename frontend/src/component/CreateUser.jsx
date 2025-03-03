import React, { useState, useRef } from 'react';
import { AlertCircle, Eye, EyeOff, Upload, X } from 'lucide-react';

const CreateUser = () => {
    const [userData, setUserData] = useState({
        username: '',
        full_name: '',
        address: '',
        phone: '',
        password: '',
        image: null
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase &&
            hasNumbers && hasSpecialChar;
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phone);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', content: 'Image size must be less than 5MB' });
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                setMessage({ type: 'error', content: 'Only JPEG, PNG and WebP images are allowed' });
                return;
            }

            setUserData({ ...userData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate all fields
        if (!validatePassword(userData.password)) {
            setMessage({
                type: 'error',
                content: 'Password must be at least 8 characters and contain uppercase, lowercase, numbers and special characters'
            });
            setLoading(false);
            return;
        }

        if (!validatePhone(userData.phone)) {
            setMessage({
                type: 'error',
                content: 'Please enter a valid phone number'
            });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            if (userData[key] !== null) formData.append(key, userData[key]);
        });

        try {
            const response = await fetch('http://localhost:5000/api/users/create', {
                method: 'POST',
                body: formData,
                credentials: 'include' // For handling cookies if needed
            });

            if (!response.ok) throw new Error('Server error occurred');

            const data = await response.json();
            setMessage({ type: 'success', content: `User created successfully with ID: ${data.user.id}` });
            setUserData({
                username: '',
                full_name: '',
                address: '',
                phone: '',
                password: '',
                image: null
            });
            setImagePreview('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setMessage({
                type: 'error',
                content: err.message || 'An error occurred while creating the user'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-base-100 rounded-lg shadow-xl">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-center mb-8">Create New User</h1>

                    {message.content && (
                        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} mb-6`}>
                            <AlertCircle className="w-6 h-6" />
                            <span>{message.content}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={userData.username}
                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                placeholder="Enter username"
                                required
                                minLength={3}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={userData.full_name}
                                onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                value={userData.address}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                placeholder="Enter address"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone</span>
                            </label>
                            <input
                                type="tel"
                                className="input input-bordered w-full"
                                value={userData.phone}
                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pr-10"
                                    value={userData.password}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Image</span>
                            </label>
                            <div className="flex flex-col items-center gap-4">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-circle btn-sm absolute -top-2 -right-2"
                                            onClick={() => {
                                                setImagePreview('');
                                                setUserData({ ...userData, image: null });
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
                                        <Upload className="w-8 h-8 mx-auto mb-2" />
                                        <p>Click to upload image</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/jpeg,image/png,image/webp"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Select Image
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn
               ${loading ? 'loading' : ''} w-full`}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;