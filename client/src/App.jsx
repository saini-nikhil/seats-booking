import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BookingForm from './components/Booking/BookingForm';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import './index.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            if (token && userData) {
                setIsAuthenticated(true);
                setUser(JSON.parse(userData));
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <Router>
            <div className="app">
                <Navbar 
                    isAuthenticated={isAuthenticated} 
                    user={user} 
                    onLogout={handleLogout} 
                />
                <main className="main-content">
                    <Routes>
                        <Route 
                            path="/login" 
                            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
                        />
                        <Route 
                            path="/register" 
                            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
                        />
                        <Route 
                            path="/dashboard" 
                            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/booking" 
                            element={isAuthenticated ? <BookingForm /> : <Navigate to="/login" />} 
                        />
                        <Route 
                            path="/" 
                            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
                        />
                    </Routes>
                </main>
                <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </Router>
    );
};

export default App;
