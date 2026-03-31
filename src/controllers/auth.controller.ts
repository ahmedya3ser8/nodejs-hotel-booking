import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User, { IUser } from "../models/User.model";

// @desc    SignUp
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phone } = req.body;
    // check if use exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      username,
      email,
      phone,
      password: hashedPassword
    });

    res.status(201).json({ 
      status: true, 
      message: 'User created successfully',
      data: sanitizeUser(user)
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // check if user exist
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // check if password matched
    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) return res.status(400).json({ message: 'Invalid email or password' });

    generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    }, res);

    res.status(201).json({ 
      status: true, 
      message: 'User login successfully',
      data: sanitizeUser(user)
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({
    status: true,
    message: 'User logged out successfully'
  })
};

export const generateToken = (payload: { id: string; email: string; role: string }, res: Response) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  })
  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true
  });
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
