import express from "express";

import { registerHotel } from "../controllers/hotel.controller";
import { protect } from "../middlewares/auth.middleware";
import { registedHotelValidator } from "../validations/hotel.validator";

const router = express.Router();

router.post('/', protect, registedHotelValidator, registerHotel);

export default router;
