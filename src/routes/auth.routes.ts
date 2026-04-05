import express from "express";

import {
  login,
  logout,
  signup
} from "../controllers/auth.controller";
import {
  loginValidator,
  singUpValidator
} from "../validations/auth.validator";

const router = express.Router();

router.post('/signup', singUpValidator, signup);
router.post('/login', loginValidator, login);
router.post('/logout', logout);

export default router;
