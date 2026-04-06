import { NextFunction, Request, Response } from "express";

import Hotel from "../models/Hotel.model";
import Room from "../models/Room.model";

import { AuthRequest } from "../middlewares/auth.middleware";
import catchAsync from "../middlewares/catchAsync.middleware";

import { deleteMultipleImages, uploadMultipleImages } from "./cloudinary.controller";
import ApiError from "../utils/apiError";

// @desc    Create Room
// @route   POST /api/rooms
// @access  Private/Protect
export const createRoom = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { roomType, pricePerNight, amenities } = req.body;

  const hotel = await Hotel.findOne({ user: req.user._id });
  if (!hotel) return next(new ApiError('No hotel found for this user', 400));

  let images: { url: string; publicId: string }[] = [];

  if (req.files) {
    images = await uploadMultipleImages(req.files as Express.Multer.File[], 'hotel-booking/rooms')
  }

  const room = await Room.create({
    roomType,
    pricePerNight,
    amenities,
    images,
    hotel: hotel._id
  });

  res.status(201).json({ 
    success: true, 
    message: 'Room Created successfully',
    data: room
  });
});

// @desc    Get All Rooms
// @route   GET /api/rooms
// @access  Public
export const getAllRooms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const rooms = await Room.find({ isAvailable: true }).populate('hotel').sort({ createdAt: -1 });

  res.status(200).json({ 
    success: true, 
    message: 'Rooms retreived successfully',
    data: rooms
  });
});

// @desc    Delete Room
// @route   DELETE /api/rooms/:id
// @access  Private/Protect
export const deleteRoom = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) return next(new ApiError('Room not found', 400));

  if (room.images) {
    const publicIds = room.images.map((el) => el.publicId);
    await deleteMultipleImages(publicIds);
  }

  res.status(200).json({ 
    success: true, 
    message: 'Room retreived successfully',
    data: null
  });
});

// @desc    Toggle Availabilty
// @route   PATCH /api/rooms/toggleAvailabilty
// @access  Private/Protect
export const toggleAvailabilty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { roomId } = req.body;

  const room = await Room.findById(roomId);
  if (!room) return next(new ApiError('Room not found', 400));
  
  room.isAvailable = !room.isAvailable;
  await room.save()

  res.status(200).json({ 
    success: true, 
    message: 'Room availabilty updated successfully',
    data: room
  });
});

// @desc    Get All Rooms For Specific Hotel
// @route   GET /api/rooms/owner
// @access  Private/Protect
export const getAllRoomsForSpecificHotel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const hotel = await Hotel.findOne({ user: req.user._id });
  if (!hotel) return next(new ApiError('No hotel found', 400));

  const rooms = await Room.find({ hotel: hotel._id }).populate('hotel');

  res.status(200).json({ 
    success: true, 
    message: 'Room Retreived successfully',
    data: rooms
  });
});
