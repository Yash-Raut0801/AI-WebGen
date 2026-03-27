import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Cart from './components/Cart';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    setCart([]); // Clear cart on logout
  };

  const addToCart = (product, qty = 1) => {
    const existItem = cart.find((x) => x.product === product._id);

    if (existItem) {
      setCart(
        cart.map((x) =>
          x.product === existItem.product ? { ...product, qty: x.qty + qty } : x
        )
      );
    } else {
      setCart([...cart, { product: product._id, name: product.name, image: product.image, price: product.price, qty }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((x) => x.product !== id));
  };

  const updateCartQty = (id, qty) => {
    setCart(cart.map(item => item.product === id ? { ...item, qty: parseInt(qty) } : item));
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} cartItemCount={cart.reduce((acc, item) => acc + item.qty, 0)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/cart" element={<Cart cartItems={cart} removeFromCart={removeFromCart} updateCartQty={updateCartQty} />} />
          <Route path="/profile" element={<Profile user={user} onUpdate={handleLogin} />} />
          {/* Add other routes for admin/checkout later */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;