import bcrypt from 'bcryptjs';
import { Response } from "express";

import { AuthRequest } from "../middlewares/auth.middleware";
import User, { IUser } from "../models/User.model";

import { deleteSingleImage, uploadSingleImage } from "./cloudinary.controller";
import { generateToken, sanitizeUser } from './auth.controller';

// @desc    Get Logged User Data
// @route   GET /api/users/getMe
// @access  Private/Protect
export const getLoggedUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      success: true, 
      message: 'User data reterived successfully',
      data: sanitizeUser(user)
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Update User Profile
// @route   PATCH /api/users/updateProfile
// @access  Private/Protect
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'ProfileImage is required' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Update User Password
// @route   PATCH /api/users/changeMyPassword
// @access  Private/Protect
export const updateLoggedUserPassword = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: await bcrypt.hash(req.body.newPassword, 10),
        passwordChangeAt: Date.now()
      },
      { new: true }
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Update Logged User Data
// @route   PATCH /api/users/updateMe
// @access  Private/Protect
export const updateLoggedUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone
      },
      { new: true }
    );

    res.status(200).json({
      success: true, 
      message: 'User updated successfully',
      data: sanitizeUser(user as IUser)
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Delete Logged User Data
// @route   DELETE /api/users/deleteMe
// @access  Private/Protect
export const deleteLoggedUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.profileImagePublicId) {
      await deleteSingleImage(user.profileImagePublicId);
    }

    res.status(200).json({
      success: true, 
      message: 'User deleted successfully',
      data: null
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
