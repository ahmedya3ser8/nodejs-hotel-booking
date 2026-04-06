import { NextFunction, Request, Response } from "express";

import Booking from "../models/Booking.model";
import Room from "../models/Room.model";
import Hotel from "../models/Hotel.model";

import { AuthRequest } from "../middlewares/auth.middleware";
import catchAsync from "../middlewares/catchAsync.middleware";
import ApiError from "../utils/apiError";

// @desc    Check Availabilty
// @route   POST /api/bookings/check-availabilty
// @access  Private/Protect
export const checkAvailabilty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { checkIn, checkOut, room } = req.body;

  const bookings = await Booking.find({
    room,
    checkIn: { $lte: checkOut },
    checkOut: { $gte: checkIn }
  });

  const isAvailable = bookings.length === 0;

  res.status(201).json({ 
    success: true, 
    message: isAvailable ? 'Room is available' : 'Room is not available'
  });
});

// @desc    Create New Booking
// @route   POST /api/bookings/book
// @access  Private/Protect
export const createBooking = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { checkIn, checkOut, room, guests } = req.body;

  const bookings = await Booking.find({
    room,
    checkIn: { $lte: checkOut },
    checkOut: { $gte: checkIn }
  });

  const isAvailable = bookings.length === 0;

  if (!isAvailable) return next(new ApiError('Room is not available', 400));

  const roomData = await Room.findById(room).populate('hotel');
  if (!roomData) return next(new ApiError('Room not found', 400));
  
  let totalPrice = roomData.pricePerNight;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diff = checkOutDate.getTime() - checkInDate.getTime();
  const numOfNights = Math.ceil(diff / (1000 * 60 * 60 * 24));

  totalPrice *= numOfNights;

  const booking = await Booking.create({
    user: req.user._id,
    room,
    hotel: roomData.hotel._id,
    guests,
    checkIn,
    checkOut,
    totalPrice
  });

  res.status(201).json({ 
    success: true, 
    message: 'Booking created successfully',
    data: booking
  });
});

// @desc    Get All Booking For User
// @route   GET /api/bookings/user
// @access  Private/Protect
export const getUserBookings = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('room hotel').sort({ createdAt: -1 });

  res.status(200).json({ 
    success: true, 
    message: 'User Booking retreived successfully',
    data: bookings
  });
});

// @desc    Get All Booking For Hotel
// @route   GET /api/bookings/hotel
// @access  Private/Protect
export const getHotelBookings = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const hotel = await Hotel.findOne({ user: req.user._id });
  if (!hotel) return next(new ApiError('No hotel found', 400));

  const bookings = await Booking.find({ hotel: hotel._id }).populate('room hotel user').sort({ createdAt: -1 });

  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

  res.status(200).json({ 
    success: true, 
    message: 'hotel booking retreived successfully',
    data: bookings,
    totalBookings,
    totalRevenue
  });
});
