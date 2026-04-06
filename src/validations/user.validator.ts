import bcrypt from 'bcryptjs';
import { body } from "express-validator";

import validator from "../middlewares/validator.middleware";
import User from "../models/User.model";

export const updateLoggedPasswordValidator = [
  body('newPassword')
    .notEmpty()
    .withMessage('newPassword is required')
    .bail()
    .matches(/^[A-Z][a-z0-9@#$]{7,}$/)
    .withMessage('newPassword must start with uppercase and be at least 8 characters'),
  body('confirmNewPassword')
    .notEmpty()
    .withMessage('confirmNewPassword is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Confirm Password incorrect')
      }
      return true;
    }),
  body('currentPassword')
    .notEmpty()
    .withMessage('Current Password is required')
    .custom(async (value, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error('User not found');
      }
      const isPassCorrect = await bcrypt.compare(value, user.password);
      if (!isPassCorrect) {
        throw new Error('Incorrect current password');
      }
      return true;
    }),
  validator
];

export const updateLoggedUserValidator = [
  body('username')
    .trim()
    .optional()
    .isLength({ min: 3 })
    .withMessage('username should be at least 3 characters'),
  body('email')
    .trim()
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id.toString() !== req.user._id.toString()) {
        throw new Error('Email already exist');
      }
      return true;
    }),
  body('phone')
    .optional()
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('Phone must start with 010, 011, 012, or 015 and be 11 digits'),
  validator
];
