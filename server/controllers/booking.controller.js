const Seat = require("../models/seat.model");
const Booking = require("../models/booking.model");

const getSeat = async (req , res) => {
  try {
    const seats = await Seat.find().sort("seatNumber");
    res.json(seats);
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUserbooking = async (req , res) => {
  try {
    const bookings = await Booking.find({ user: req.userId, isActive: true }).populate("seats");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookseats = async (req , res) => {
    try {
        const { numberOfSeats } = req.body;
        
        if (!numberOfSeats || numberOfSeats < 1 || numberOfSeats > 7) {
            return res.status(400).json({ message: 'Please enter a valid number of seats (1-7)' });
        }

        // Find available seats in the same row
        const availableSeats = await Seat.find({ isBooked: false }).sort('row seatNumber');
        
        if (availableSeats.length < numberOfSeats) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Group seats by row
        const seatsByRow = {};
        availableSeats.forEach(seat => {
            if (!seatsByRow[seat.row]) {
                seatsByRow[seat.row] = [];
            }
            seatsByRow[seat.row].push(seat);
        });

        // Find a row with enough consecutive seats
        let selectedSeats = [];
        for (const row in seatsByRow) {
            if (seatsByRow[row].length >= numberOfSeats) {
                selectedSeats = seatsByRow[row].slice(0, numberOfSeats);
                break;
            }
        }

        // If no row has enough consecutive seats, take the first available seats
        if (selectedSeats.length === 0) {
            selectedSeats = availableSeats.slice(0, numberOfSeats);
        }

        // Create booking
        const booking = new Booking({
            user: req.userId,
            seats: selectedSeats.map(seat => seat._id)
        });

        // Update seats
        await Seat.updateMany(
            { _id: { $in: selectedSeats.map(seat => seat._id) } },
            { isBooked: true, bookedBy: req.userId }
        );

        await booking.save();

        // Fetch updated seats
        const updatedSeats = await Seat.find().sort('seatNumber');

        res.status(201).json({
            message: 'Seats booked successfully',
            booking,
            seats: updatedSeats
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: error.message });  
    }
}


const CancelBooking = async (req , res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        // Update seats
        await Seat.updateMany(
            { _id: { $in: booking.seats } },
            { isBooked: false, bookedBy: null }
        );

        booking.isActive = false;
        await booking.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}


module.exports = {CancelBooking ,bookseats ,getUserbooking , getSeat}

