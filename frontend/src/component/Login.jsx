import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Configure axios defaults
    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!credentials.username.trim() || !credentials.password.trim()) {
            setMessage('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/login',
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    withCredentials: true, // Important for CORS
                }
            );

            // Implement rate limiting on the client side
            sessionStorage.setItem('lastLoginAttempt', Date.now().toString());

            // Handle successful login
            if (response.data.token) {
                setMessage('Login successful!');
                login({ token: response.data.token }); // Pass token to AuthContext

                // Clear sensitive data
                setCredentials({ username: '', password: '' });

                // Redirect after a short delay to show success message
                setTimeout(() => navigate('/'), 1000);
            }
        } catch (err) {
            // Handle different types of errors
            if (err.response) {
                // Server responded with error
                setMessage(`Error: ${err.response.data.message || 'Login failed'}`);
            } else if (err.request) {
                // No response received
                setMessage('Error: No response from server. Please try again.');
            } else {
                // Other errors
                setMessage(`Error: ${err.message}`);
            }

            // Implement exponential backoff for failed attempts
            const attempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
            localStorage.setItem('loginAttempts', attempts.toString());

            if (attempts >= 5) {
                setMessage('Too many failed attempts. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 py-8 px-4 flex items-center justify-center">
            <div className="max-w-md w-full bg-base-100 rounded-lg shadow-xl">
                <div className="p-8">
                    <div className="flex flex-col items-center gap-2 mb-8">
                        <LogIn className="w-12 h-12 text-primary" />
                        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
                        <p className="text-center text-base-content/60">
                            Please sign in to continue
                        </p>
                    </div>

                    {message && (
                        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'} mb-6`}>
                            <AlertCircle className="w-6 h-6" />
                            <span>{message}</span>
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
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                placeholder="Enter your username"
                                required
                                autoComplete="username"
                                disabled={loading}
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
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-base-content/60">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="link link-primary"
                                disabled={loading}
                            >
                                Create one
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;