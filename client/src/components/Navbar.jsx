import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Train Seat Booking</Link>
            </div>

            <button 
                className="mobile-menu-button" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                {/* If Font Awesome isn't available, use text alternative */}
                {menuOpen ? "✕" : "☰"}
            </button>

            <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                {isAuthenticated() ? (
                    <>
                        <span>Welcome, {user?.username}</span>
                        <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                        <Link to="/booking" onClick={closeMenu}>Book Seats</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={closeMenu}>Login</Link>
                        <Link to="/register" onClick={closeMenu}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 