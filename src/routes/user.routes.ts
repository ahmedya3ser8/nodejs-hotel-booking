import express from "express";

import {
  deleteLoggedUser,
  getLoggedUser,
  updateLoggedUser,
  updateLoggedUserPassword,
  updateProfile
} from "../controllers/user.controller";
import {
  updateLoggedPasswordValidator,
  updateLoggedUserValidator
} from "../validations/user.validator";

import { protect } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorize.middleware";

import upload from "../config/multer";

const router = express.Router();

router.use(protect, authorizeRoles('user', 'admin'));

router.get('/getMe', getLoggedUser);
router.patch('/changeMyPassword', updateLoggedPasswordValidator, updateLoggedUserPassword);
router.patch('/updateProfile', upload.single('profileImage'), updateProfile);
router.patch('/updateMe', updateLoggedUserValidator, updateLoggedUser);
router.delete('/deleteMe', deleteLoggedUser);

export default router;
