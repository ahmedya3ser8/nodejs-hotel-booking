import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

import connectDB from './config/db';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/user.routes';
import hotelsRoutes from './routes/hotel.routes';
import roomsRoutes from './routes/room.routes';
import bookingRoutes from './routes/booking.routes';

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/hotels', hotelsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  connectDB();
});
