import { body } from "express-validator";

import validator from "../middlewares/validator.middleware";

export const registedHotelValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('address')
    .notEmpty()
    .withMessage('Address is required'),
  body('contact')
    .notEmpty()
    .withMessage('Contact is required'),
  body('city')
    .notEmpty()
    .withMessage('City is required'),
  body('user')
    .notEmpty()
    .withMessage('User Id is required')
    .isMongoId()
    .withMessage('Invalid mongoId'),
  validator
];
