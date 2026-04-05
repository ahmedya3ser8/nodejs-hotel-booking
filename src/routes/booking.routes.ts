import express from "express";

import { checkAvailabilty, createBooking, getHotelBookings, getUserBookings } from "../controllers/booking.controller";
import { checkAvailabiltyValidator, createBookingValidator } from "../validations/booking.validator";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(protect);

router.post('/check-availabilty', checkAvailabiltyValidator, checkAvailabilty);
router.post('/book', createBookingValidator, createBooking);

router.get('/user', getUserBookings);
router.get('/hotel', getHotelBookings);

export default router;
