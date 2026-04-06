import { body } from "express-validator";

import validator from "../middlewares/validator.middleware";

export const singUpValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('username is required')
    .isLength({ min: 3 })
    .withMessage('username should be at least 3 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .matches(/^[A-Z][a-z0-9@#$]{7,}$/)
    .withMessage('Password must start with uppercase and be at least 8 characters'),
  body('phone')
    .notEmpty()
    .withMessage('phone is required')
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage('Phone must start with 010, 011, 012, or 015 and be 11 digits'),
  validator
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('password is required'),
  validator
];
