import { Response } from "express";

import Hotel from "../models/Hotel.model";
import User from "../models/User.model";

import { AuthRequest } from "../middlewares/auth.middleware";

// @desc    Register Hotel
// @route   POST /api/hotels
// @access  Private/Protect
export const registerHotel = async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, contact, city } = req.body;

    const hotel = await Hotel.findOne({ user: req.user._id });
    if (hotel) return res.status(400).json({ message: 'Hotel already registerd' });

    const registerdHotel = await Hotel.create({
      name,
      address,
      contact,
      city,
      user: req.user._id
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'admin' });

    res.status(201).json({ 
      success: true, 
      message: 'User registerd successfully',
      data: registerdHotel
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
