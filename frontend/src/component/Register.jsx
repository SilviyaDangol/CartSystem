import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Upload, X, UserPlus } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        full_name: '',
        address: '',
        phone: '',
        password: '',
        image: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phone);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage('Error: Image size must be less than 5MB');
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                setMessage('Error: Only JPEG, PNG and WebP images are allowed');
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

        if (!validatePassword(userData.password)) {
            setMessage('Error: Password must be at least 8 characters and contain uppercase, lowercase, numbers and special characters');
            setLoading(false);
            return;
        }

        if (!validatePhone(userData.phone)) {
            setMessage('Error: Please enter a valid phone number');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            if (userData[key] !== null) {
                formData.append(key, userData[key]);
            }
        });

        try {
            const response = await axios.post('http://localhost:5000/api/users/create',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            );

            setMessage(`Registration successful! Welcome, ${response.data.user.full_name}`);
            setUserData({
                username: '',
                full_name: '',
                address: '',
                phone: '',
                password: '',
                image: null,
            });
            setImagePreview('');
            if (fileInputRef.current) fileInputRef.current.value = '';

            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage(err.response ?
                `Error: ${err.response.data.message || 'Registration failed'}` :
                err.request ?
                    'Error: No response from server. Please try again.' :
                    `Error: ${err.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-base-100 rounded-xl shadow-xl overflow-hidden">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <UserPlus className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-base-content">Create your account</h1>
                        <p className="text-base-content/60 mt-2">Join our community and get started today</p>
                    </div>

                    {/* Alert Message */}
                    {message && (
                        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'} mb-6`}>
                            <AlertCircle className="w-5 h-5" />
                            <span>{message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image Upload */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-circle btn-sm absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                    <div
                                        className="w-32 h-32 rounded-full bg-base-200 flex flex-col items-center justify-center cursor-pointer hover:bg-base-300 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-8 h-8 mb-1 text-base-content/60" />
                                        <span className="text-sm text-base-content/60">Upload Photo</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/jpeg,image/png,image/webp"
                                />
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <input
                                    type="text"
                                    className="input input-bordered w-full bg-base-100"
                                    value={userData.username}
                                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                    placeholder="Username"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-control">
                                <input
                                    type="text"
                                    className="input input-bordered w-full bg-base-100"
                                    value={userData.full_name}
                                    onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                                    placeholder="Full Name"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-control">
                                <input
                                    type="tel"
                                    className="input input-bordered w-full bg-base-100"
                                    value={userData.phone}
                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                    placeholder="Phone Number"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-control relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pr-10 bg-base-100"
                                    value={userData.password}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    placeholder="Password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <textarea
                                className="textarea textarea-bordered bg-base-100"
                                value={userData.address}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                placeholder="Address"
                                required
                                disabled={loading}
                                rows="3"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <p className="text-center text-base-content/60">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-primary hover:text-primary-focus transition-colors"
                                    disabled={loading}
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;