import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BookingForm from './components/Booking/BookingForm';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route 
                        path="/login" 
                        element={!isAuthenticated() ? <Login /> : <Navigate to="/dashboard" />} 
                    />
                    <Route 
                        path="/register" 
                        element={!isAuthenticated() ? <Register /> : <Navigate to="/dashboard" />} 
                    />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/booking" element={<BookingForm />} />
                    </Route>
                    <Route 
                        path="/" 
                        element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} 
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
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

export default App;
