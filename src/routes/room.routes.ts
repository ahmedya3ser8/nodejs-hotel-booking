import express from "express";

import { protect } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorize.middleware";

import { createRoom, deleteRoom, getAllRooms, getAllRoomsForSpecificHotel, toggleAvailabilty } from "../controllers/room.controller";
import { createRoomValidator, toggleAvailabiltyValidator } from "../validations/room.validator";

import upload from "../config/multer";

const router = express.Router();

router.use(protect);

router.get('/', getAllRooms);

router.use(authorizeRoles('admin'));

router.get('/owner', getAllRoomsForSpecificHotel);
router.post('/', upload.array('images', 5), createRoomValidator, createRoom);
router.patch('/toggleAvailabilty', toggleAvailabiltyValidator, toggleAvailabilty);
router.delete('/:id', deleteRoom);

export default router;
