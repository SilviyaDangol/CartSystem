import React, { useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    Settings,
    User,
    Package,
    BarChart,
    LogOut,
    Menu,
    ChevronDown,
    Plus
} from 'lucide-react';
import Cart from "./Cart";

const NavLink = ({ to, children, icon: Icon }) => (
    <Link
        to={to}
        className="btn btn-ghost btn-sm normal-case gap-2"
    >
        {Icon && <Icon size={18} />}
        {children}
    </Link>
);

const AdminNav = () => (
    <div className="flex items-center gap-2">
        <NavLink to="/categories" icon={Package}>Categories</NavLink>
        <NavLink to="/create-category" icon={Plus}>New Category</NavLink>
        <NavLink to="/create-product" icon={Package}>New Product</NavLink>
        <NavLink to="/create-user" icon={User}>New User</NavLink>
        <NavLink to="/stats" icon={BarChart}>Stats</NavLink>
    </div>
);

const UserNav = () => (
    <div className="flex items-center gap-2">
        <NavLink to="/categories" icon={Package}>Categories</NavLink>
        <NavLink to="/ProductListing" icon={Package}>Products</NavLink>
        <Cart /> {/* Replace the NavLink with direct Cart component */}
    </div>
);

const GuestNav = () => (
    <div className="flex items-center gap-2">
        <NavLink to="/login" icon={User}>Login</NavLink>
        <NavLink to="/register" icon={User}>Register</NavLink>
    </div>
);

const Layout = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const adminRoutes = ['/create-category', '/create-product', '/create-user', '/stats'];

    useEffect(() => {
        if (!auth.user) {
            if (adminRoutes.includes(location.pathname) ||
                location.pathname.startsWith('/categories') ||
                location.pathname.startsWith('/products')) {
                navigate('/login');
            }
        } else if (auth.user.role !== 'admin' && adminRoutes.includes(location.pathname)) {
            navigate('/');
        }
    }, [auth.user, location.pathname, navigate]);

    if (!auth) return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    const { user, logout } = auth;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderNav = () => {
        if (!user) return <GuestNav />;
        return user.role === 'admin' ? <AdminNav /> : <UserNav />;
    };

    const getNavTheme = () => {
        if (!user) return 'navbar-neutral';
        return user.role === 'admin' ? 'navbar-primary' : 'navbar-info';
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className={`navbar ${getNavTheme()} text-neutral-content shadow-lg`}>
                <div className="navbar-start">
                    {/* Mobile Menu */}
                    <div className="dropdown lg:hidden">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <Menu />
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {renderNav()}
                        </ul>
                    </div>

                    {/* Desktop Logo */}
                    <Link to="/" className="btn btn-ghost normal-case text-xl gap-2">
                        <Home />
                        {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-center hidden lg:flex">
                    {renderNav()}
                </div>

                {/* User Menu */}
                <div className="navbar-end">
                    {user && (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost gap-2">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                        <span>{user.username[0].toUpperCase()}</span>
                                    </div>
                                </div>
                                <span className="hidden md:inline">{user.username}</span>
                                <ChevronDown className="h-4 w-4" />
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <a className="justify-between">
                                        <span className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Profile
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <span className="flex items-center gap-2">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a onClick={handleLogout} className="text-error">
                                        <span className="flex items-center gap-2">
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;