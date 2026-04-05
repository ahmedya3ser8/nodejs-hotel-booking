import { Request, Response } from "express";

import Hotel from "../models/Hotel.model";

import Room from "../models/Room.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { deleteMultipleImages, uploadMultipleImages } from "./cloudinary.controller";

// @desc    Create Room
// @route   POST /api/rooms
// @access  Private/Protect
export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    const hotel = await Hotel.findOne({ user: req.user._id });
    if (!hotel) return res.status(400).json({ message: 'No hotel found for this user' });

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get All Rooms
// @route   GET /api/rooms
// @access  Public
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({ isAvailable: true }).populate('hotel').sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      message: 'Rooms retreived successfully',
      data: rooms
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Delete Room
// @route   DELETE /api/rooms/:id
// @access  Private/Protect
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(400).json({ message: 'Room not found' });

    if (room.images) {
      const publicIds = room.images.map((el) => el.publicId);
      await deleteMultipleImages(publicIds);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Room retreived successfully',
      data: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Toggle Availabilty
// @route   PATCH /api/rooms/toggleAvailabilty
// @access  Private/Protect
export const toggleAvailabilty = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(400).json({ message: 'Room not found' });
    
    room.isAvailable = !room.isAvailable;
    await room.save()

    res.status(200).json({ 
      success: true, 
      message: 'Room availabilty updated successfully',
      data: room
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get All Rooms For Specific Hotel
// @route   GET /api/rooms/owner
// @access  Private/Protect
export const getAllRoomsForSpecificHotel = async (req: AuthRequest, res: Response) => {
  try {
    const hotel = await Hotel.findOne({ user: req.user._id });
    if (!hotel) return res.status(400).json({ message: 'No hotel found' });

    const rooms = await Room.find({ hotel: hotel._id }).populate('hotel');

    res.status(200).json({ 
      success: true, 
      message: 'Room Retreived successfully',
      data: rooms
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
