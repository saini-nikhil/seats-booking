import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import SeatLayout from './SeatLayout';
import './Booking.css';

const BookingForm = () => {
    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const [loading, setLoading] = useState(false);
    const [availableSeats, setAvailableSeats] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAvailableSeats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login to view seats');
                    return;
                }

                const response = await api.get('/bookings/seats');
                const available = response.data.filter(seat => !seat.isBooked).length;
                setAvailableSeats(available);
            } catch (err) {
                console.error('Error fetching seats:', err);
                toast.error('Failed to fetch seats');
            }
        };

        fetchAvailableSeats();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (numberOfSeats < 1 || numberOfSeats > 7) {
            toast.error('Please select between 1 and 7 seats');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to book seats');
                navigate('/login');
                return;
            }

            const response = await api.post(
                '/bookings/book',
                { numberOfSeats }
            );

            toast.success('Seats booked successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || 'Failed to book seats');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-container">
            <div className="booking-header">
                <h2>Book Your Train Seats</h2>
                <p>Select the number of seats you want to book (maximum 7 seats per booking)</p>
            </div>
            
            <div className="booking-content">
                <div className="booking-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="numberOfSeats">Number of Seats</label>
                            <input
                                type="number"
                                id="numberOfSeats"
                                min="1"
                                max="7"
                                value={numberOfSeats || ''}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value) && value >= 1 && value <= 7) {
                                        setNumberOfSeats(value);
                                    }
                                }}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Booking...' : 'Book Seats'}
                        </button>
                    </form>
                </div>
                
                <div className="seat-layout-container">
                    <SeatLayout />
                </div>
            </div>
        </div>
    );
};

export default BookingForm; 