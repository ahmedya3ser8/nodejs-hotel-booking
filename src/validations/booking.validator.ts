import { body } from "express-validator";

import validator from "../middlewares/validator.middleware";

export const checkAvailabiltyValidator = [
  body('checkIn')
    .notEmpty()
    .withMessage('CheckIn is required')
    .isISO8601() //EX YYYY-MM-DD (2026-04-10)
    .withMessage('CheckIn must be a valid date'),
  body('checkOut')
    .notEmpty()
    .withMessage('CheckOut is required')
    .isISO8601() 
    .withMessage('CheckOut must be a valid date'),
  body('room')
    .notEmpty()
    .withMessage('roomId is required')
    .isMongoId()
    .withMessage('Invalid mongoId'),
  validator
];

export const createBookingValidator = [
  body('checkIn')
    .notEmpty()
    .withMessage('CheckIn is required')
    .isISO8601() //EX YYYY-MM-DD (2026-04-10)
    .withMessage('CheckIn must be a valid date'),
  body('checkOut')
    .notEmpty()
    .withMessage('CheckOut is required')
    .isISO8601() 
    .withMessage('CheckOut must be a valid date'),
  body('room')
    .notEmpty()
    .withMessage('roomId is required')
    .isMongoId()
    .withMessage('Invalid mongoId'),
  body('guests')
    .notEmpty()
    .withMessage('guests is required')
    .isNumeric()
    .withMessage('guests must be a number'),
  validator
];
