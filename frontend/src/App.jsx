import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './component/Login';
import Register from './component/Register';
import Layout from './component/Layout';
import CreateCategory from './component/CreateCategory';
import CreateProduct from './component/CreateProduct';
import CreateUser from './component/CreateUser';
import Stats from './component/Stats';
import CategoryList from './component/CategoryList';
import ProductListing from './component/ProductListing';
import Cart from "./component/Cart.jsx";
import Checkout from "./component/Checkout.jsx";
import Orders from "./component/Orders.jsx";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Layout />}>
                        <Route path="/create-category" element={<CreateCategory />} />
                        <Route path="/create-product" element={<CreateProduct />} />
                        <Route path="/create-user" element={<CreateUser />} />
                        <Route path="/stats" element={<Stats />} />
                        <Route path="/categories" element={<CategoryList />} />
                        <Route path="/ProductListing" element={<ProductListing />} />
                        <Route path="/cart" element={<Cart/>} />
                        <Route path="/checkout" element={<Checkout/>} />
                        <Route path="/orders" element={<Orders/>} />
                        {/* Add this as the default route for Layout */}
                        <Route index element={<div>Welcome to the Dashboard</div>} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;