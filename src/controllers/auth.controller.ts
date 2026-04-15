import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import User, { IUser } from "../models/User.model";
import catchAsync from '../middlewares/catchAsync.middleware';
import ApiError from '../utils/apiError';
import { cookieConfig } from '../config/cookie';

// @desc    SignUp
// @route   POST /api/auth/signup
// @access  Public
export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError('User already exists', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    phone,
    password: hashedPassword
  });

  res.status(201).json({ 
    success: true, 
    message: 'User created successfully',
    data: sanitizeUser(user)
  })
});

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ApiError('Invalid email or password', 400));

  const isMatchedPassword = await bcrypt.compare(password, user.password);
  if (!isMatchedPassword) return next(new ApiError('Invalid email or password', 400));

  generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role
  }, res);

  res.status(201).json({ 
    success: true, 
    message: 'User login successfully',
    data: sanitizeUser(user)
  })
});

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Public
export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('hb_session', cookieConfig);
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  })
});

export const generateToken = (payload: { id: string; email: string; role: string }, res: Response) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  })
  res.cookie('hb_session', token, cookieConfig);
  return token;
};

export const sanitizeUser = (user: IUser) => {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
};
