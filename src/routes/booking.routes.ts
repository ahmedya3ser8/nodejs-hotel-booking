import express from "express";

import { checkAvailabilty, createBooking, getHotelBookings, getUserBookings } from "../controllers/booking.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.post('/check-availabilty', protect, checkAvailabilty);
router.post('/book', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/hotel', protect, getHotelBookings);

export default router;
