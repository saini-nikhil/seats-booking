# Train Seat Booking System

A full-stack web application for booking train seats, featuring user authentication, seat visualization, and booking management capabilities.

## Features

- **User Authentication**: Register, login, and persistent sessions
- **Seat Booking**: Book up to 7 seats at once
- **Interactive Seat Layout**: Visual representation of available and booked seats
- **Booking Management**: View and cancel your bookings
- **Dashboard**: See statistics about your bookings
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React 18 (with React Router v6)
- Vite (for fast development and optimized builds)
- Axios (for API requests)
- React-Toastify (for notifications)
- Context API (for state management)

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── assets/         # Images, icons, etc.
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers (Auth)
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS styles
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies and scripts
│
├── server/                 # Backend Node.js application
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middlewares
│   ├── models/             # Mongoose data models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   ├── .env                # Environment variables
│   ├── index.js            # Server entry point
│   └── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd train-seat-booking
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Configure server environment
Create a `.env` file in the server directory:
```
MONGODB_URI=mongodb://localhost:27017/train-booking
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Install client dependencies
```bash
cd ../client
npm install
```

5. Configure client environment
Create a `.env` file in the client directory:
```
VITE_API_URL=https://seats-booking.vercel.app/
```

### Running the Application

1. Start the server
```bash
cd server
npm run dev
```

2. Start the client
```bash
cd client
npm run dev
```

3. Access the application at https://seats-booking.vercel.app/

## Deployment

### Backend
The backend can be deployed to platforms like:
- Heroku
- Railway
- Render

### Frontend
The frontend can be deployed to:
- Vercel
- Netlify
- GitHub Pages

When deploying, make sure to:
1. Update the `.env` files with production URLs
2. Set the appropriate environment variables on your hosting platform



## Acknowledgements

- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Vite](https://vitejs.dev/)
 
