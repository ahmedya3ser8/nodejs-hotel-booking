import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './config/db';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/user.routes';
import hotelsRoutes from './routes/hotel.routes';
import roomsRoutes from './routes/room.routes';
import bookingRoutes from './routes/booking.routes';

import ApiError from './utils/apiError';
import globalError from './middlewares/globalError.middleware';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4200'
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/hotels', hotelsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`This resource: ${req.originalUrl} is not available`, 400));
})

// Global Error
app.use(globalError);

const server =app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  connectDB();
});

process.on('unhandledRejection', (err: any) => {
  console.log(`UnhandledRejection Errors: ${err.name} | ${err.message} `);
  server.close(() => {
    console.log('Shutting down....');
    process.exit(1);
  });
})