import { NextFunction, Response } from "express";

import Hotel from "../models/Hotel.model";
import User from "../models/User.model";

import { AuthRequest } from "../middlewares/auth.middleware";
import catchAsync from "../middlewares/catchAsync.middleware";

import ApiError from "../utils/apiError";

// @desc    Register Hotel
// @route   POST /api/hotels
// @access  Private/Protect
export const registerHotel = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, address, contact, city } = req.body;

  const hotel = await Hotel.findOne({ user: req.user._id });
  if (hotel) return next(new ApiError('Hotel already registerd', 400));

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
});
