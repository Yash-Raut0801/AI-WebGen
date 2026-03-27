import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Assuming Navbar.css has specific styling if needed, otherwise App.css
// Icons can be added using a library or SVG for cart/user

function Navbar({ user, onLogout, cartItemCount }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">
            LuxeWear
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            {user ? (
              <li className="dropdown">
                <Link to="#">{user.name}</Link>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  {user.isAdmin && <Link to="/admin/dashboard">Admin</Link>}
                  <Link to="#" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/cart" className="cart-icon">
                Cart {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;