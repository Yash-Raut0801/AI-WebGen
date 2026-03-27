import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link
} from 'react-router-dom';
import Home from './components/Home';
import Menu from './components/Menu';
import ReservationForm from './components/ReservationForm';
import AdminMenu from './components/AdminMenu';
import AdminReservations from './components/AdminReservations';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <Link to="/" className="nav-brand">The Restaurant</Link>
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/menu">Menu</Link>
                        <Link to="/reservations">Reservations</Link>
                        <Link to="/admin/menu">Admin Menu</Link>
                        <Link to="/admin/reservations">Admin Reservations</Link>
                    </div>
                </nav>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/reservations" element={<ReservationForm />} />
                        <Route path="/admin/menu" element={<AdminMenu />} />
                        <Route path="/admin/reservations" element={<AdminReservations />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;