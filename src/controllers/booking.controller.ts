import { Request, Response } from "express";

import Booking from "../models/Booking.model";
import Room from "../models/Room.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import Hotel from "../models/Hotel.model";

// @desc    Check Availabilty
// @route   POST /api/bookings/check-availabilty
// @access  Private/Protect
export const checkAvailabilty = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Create New Booking
// @route   POST /api/bookings/book
// @access  Private/Protect
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { checkIn, checkOut, room, guests } = req.body;

    const bookings = await Booking.find({
      room,
      checkIn: { $lte: checkOut },
      checkOut: { $gte: checkIn }
    });

    const isAvailable = bookings.length === 0;

    if (!isAvailable) return res.status(400).json({ message: 'Room is not available' });

    const roomData = await Room.findById(room).populate('hotel');
    if (!roomData) return res.status(400).json({ message: 'Room not found' });
    
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get All Booking For User
// @route   GET /api/bookings/user
// @access  Private/Protect
export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('room hotel').sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      message: 'User Booking retreived successfully',
      data: bookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get All Booking For Hotel
// @route   GET /api/bookings/hotel
// @access  Private/Protect
export const getHotelBookings = async (req: AuthRequest, res: Response) => {
  try {
    const hotel = await Hotel.findOne({ user: req.user._id });
    if (!hotel) return res.status(400).json({ message: 'No hotel found' });

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
