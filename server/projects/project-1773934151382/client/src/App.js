import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AddMenuItem from './components/AddMenuItem';
import EditMenuItem from './components/EditMenuItem';
import PrivateRoute from './utils/PrivateRoute';
import { logout } from './services/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="App">
      <header className="navbar">
        <Link to="/" className="navbar-brand">Our Restaurant</Link>
        <nav className="navbar-nav">
          <Link to="/">Menu</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
              <span>Hello, {user.username}!</span>
              <button onClick={handleLogout} className="nav-button">Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/add" element={<PrivateRoute allowedRoles={['admin']}><AddMenuItem /></PrivateRoute>} />
          <Route path="/admin/edit/:id" element={<PrivateRoute allowedRoles={['admin']}><EditMenuItem /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;