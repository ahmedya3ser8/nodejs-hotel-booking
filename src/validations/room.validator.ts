import { body } from "express-validator";

import validator from "../middlewares/validator.middleware";

export const createRoomValidator = [
  body('roomType')
    .notEmpty()
    .withMessage('RoomType is required'),
  body('pricePerNight')
    .notEmpty()
    .withMessage('PricePerNight is required'),
  body('amenities')
    .notEmpty()
    .withMessage('Amenities is required'),
  validator
];

export const toggleAvailabiltyValidator = [
  body('roomId')
    .isMongoId()
    .withMessage('Invalid mongoId')
    .notEmpty()
    .withMessage('RoomId is required'),
  validator
];
