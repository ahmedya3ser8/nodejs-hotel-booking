import bcrypt from 'bcryptjs';
import { NextFunction, Response } from "express";

import { AuthRequest } from "../middlewares/auth.middleware";
import catchAsync from '../middlewares/catchAsync.middleware';

import User, { IUser } from "../models/User.model";
import ApiError from '../utils/apiError';

import { deleteSingleImage, uploadSingleImage } from "./cloudinary.controller";
import { generateToken, sanitizeUser } from './auth.controller';

// @desc    Get Logged User Data
// @route   GET /api/users/getMe
// @access  Private/Protect
export const getLoggedUser = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ApiError('User not found', 400));

  res.status(200).json({
    success: true, 
    message: 'User data reterived successfully',
    data: sanitizeUser(user)
  })
});

// @desc    Update User Profile
// @route   PATCH /api/users/updateProfile
// @access  Private/Protect
export const updateProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.file) return next(new ApiError('ProfileImage is required', 400));

  const user = await User.findById(req.user._id);
  if (!user) return next(new ApiError('User not found', 400));

  // delete old image if exists
  if (user.profileImagePublicId) {
    await deleteSingleImage(user.profileImagePublicId);
  }

  const uploadResponse = await uploadSingleImage(req.file, 'hotel-booking/users');

  user.profileImage = uploadResponse.url;
  user.profileImagePublicId = uploadResponse.publicId;

  await user.save();

  res.status(200).json({
    success: true, 
    message: 'User update profile successfully',
    data: sanitizeUser(user)
  })
});

// @desc    Update User Password
// @route   PATCH /api/users/changeMyPassword
// @access  Private/Protect
export const updateLoggedUserPassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 10),
      passwordChangeAt: Date.now()
    },
    { returnDocument: 'after' }
  );

  generateToken({
    id: user!._id.toString(),
    email: user!.email,
    role: user!.role
  }, res);

  res.status(200).json({
    success: true, 
    message: 'User update password successfully',
    data: sanitizeUser(user as IUser)
  })
});

// @desc    Update Logged User Data
// @route   PATCH /api/users/updateMe
// @access  Private/Protect
export const updateLoggedUser = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone
    },
    { returnDocument: 'after' }
  );

  res.status(200).json({
    success: true, 
    message: 'User updated successfully',
    data: sanitizeUser(user as IUser)
  })
});

// @desc    Delete Logged User Data
// @route   DELETE /api/users/deleteMe
// @access  Private/Protect
export const deleteLoggedUser = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) return next(new ApiError('User not found', 400));

  if (user.profileImagePublicId) {
    await deleteSingleImage(user.profileImagePublicId);
  }

  res.status(200).json({
    success: true, 
    message: 'User deleted successfully',
    data: null
  })
});
