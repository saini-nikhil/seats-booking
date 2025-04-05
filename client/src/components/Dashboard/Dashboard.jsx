import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBookings: 0,
        activeBookings: 0,
        totalSeats: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login to view bookings');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/bookings/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(response.data);
                
                // Calculate stats
                const activeBookings = response.data.filter(booking => booking.isActive);
                const totalSeats = response.data.reduce((acc, booking) => acc + booking.seats.length, 0);
                
                setStats({
                    totalBookings: response.data.length,
                    activeBookings: activeBookings.length,
                    totalSeats: totalSeats
                });
            } catch (err) {
                console.error('Error fetching bookings:', err);
                toast.error('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to cancel bookings');
                return;
            }

            await axios.post(
                `http://localhost:5000/api/bookings/cancel/${bookingId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success('Booking cancelled successfully');
            // Refresh bookings
            const response = await axios.get('http://localhost:5000/api/bookings/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data);
            
            // Update stats
            const activeBookings = response.data.filter(booking => booking.isActive);
            const totalSeats = response.data.reduce((acc, booking) => acc + booking.seats.length, 0);
            
            setStats({
                totalBookings: response.data.length,
                activeBookings: activeBookings.length,
                totalSeats: totalSeats
            });
        } catch (err) {
            console.error('Error cancelling booking:', err);
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    if (loading) {
        return <div className="dashboard-loading">Loading your bookings...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h2>Your Dashboard</h2>
                    <p>Manage your train seat bookings</p>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-number">{stats.totalBookings}</div>
                        <div className="stat-label">Total Bookings</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.activeBookings}</div>
                        <div className="stat-label">Active Bookings</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.totalSeats}</div>
                        <div className="stat-label">Total Seats Booked</div>
                    </div>
                </div>

                <div className="bookings-section">
                    <div className="section-header">
                        <h3>Your Bookings</h3>
                        <button 
                            onClick={() => navigate('/booking')}
                            className="new-booking-btn"
                        >
                            Book New Seats
                        </button>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="no-bookings">
                            <h3>No Bookings Found</h3>
                            <p>You haven't made any bookings yet. Start by booking your first seats!</p>
                            <button 
                                onClick={() => navigate('/booking')}
                                className="new-booking-btn"
                            >
                                Book Your First Seats
                            </button>
                        </div>
                    ) : (
                        <div className="booking-list">
                            {bookings.map(booking => (
                                <div key={booking._id} className="booking-card">
                                    <div className="booking-info">
                                        <div className="booking-id">Booking #{booking._id.slice(-6)}</div>
                                        <div className="booking-details">
                                            <p>Booked on {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                        </div>
                                        <div className="booking-seats">
                                            Seats: {booking.seats.map(seat => seat.seatNumber).join(', ')}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleCancelBooking(booking._id)}
                                        className="cancel-booking-btn"
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 