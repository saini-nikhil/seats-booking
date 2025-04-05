import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Booking.css';

const SeatLayout = () => {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userBookedSeats, setUserBookedSeats] = useState([]);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login to view seats');
                    setLoading(false);
                    return;
                }

                // Fetch all seats
                const seatsResponse = await axios.get('http://localhost:5000/api/bookings/seats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSeats(seatsResponse.data);

                try {
                    // Fetch user's bookings
                    const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    // Extract seat IDs from user's bookings
                    const userSeatIds = bookingsResponse.data.reduce((acc, booking) => {
                        return [...acc, ...booking.seats.map(seat => seat._id)];
                    }, []);
                    setUserBookedSeats(userSeatIds);
                } catch (err) {
                    console.error('Error fetching user bookings:', err);
                    setUserBookedSeats([]);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching seats:', err);
                toast.error('Failed to fetch seats');
                setLoading(false);
            }
        };
        fetchSeats();
    }, []);

    const renderSeat = (seat) => {
        let seatClass = 'seat';
        if (seat.isBooked) {
            seatClass += userBookedSeats.includes(seat._id) ? ' user-booked' : ' booked';
        } else {
            seatClass += ' available';
        }

        return (
            <div
                key={seat.seatNumber}
                className={seatClass}
                title={`Seat ${seat.seatNumber}`}
            >
                {seat.seatNumber}
            </div>
        );
    };

    const renderRow = (rowNumber) => {
        const rowSeats = seats.filter(seat => seat.row === rowNumber);
        return (
            <div key={rowNumber} className="seat-row">
                <div className="row-number">Row {rowNumber}</div>
                <div className="seats-container">
                    {rowSeats.map(renderSeat)}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading seats...</div>;
    }

    return (
        <div className="seat-layout">
            <h3>Train Seat Layout</h3>
            <div className="legend">
                <div className="legend-item">
                    <div className="seat available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="seat booked"></div>
                    <span>Booked by Others</span>
                </div>
                <div className="legend-item">
                    <div className="seat user-booked"></div>
                    <span>Your Bookings</span>
                </div>
            </div>
            <div className="train-layout">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(renderRow)}
            </div>
        </div>
    );
};

export default SeatLayout; 