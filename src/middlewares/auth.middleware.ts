import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from "../models/User.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1) check if token exist
    const token = req.cookies.hb_session;
    if (!token) return res.status(401).json({ message: 'Not authorized, please login to access this route' });

    // 2) verify token (changes happen, expire token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded) return res.status(401).json({ message: 'Unauthorized - Invalid token' });

    // 3) check if user exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'The user belonging to this token no longer exists' });

    // 4) check if user change password after token created
    if (user.passwordChangeAt) {
      const passwordChangeTime = user.passwordChangeAt.getTime() / 1000;
      if (passwordChangeTime > decoded.iat!) {
        return res.status(401).json({ message: 'Password was changed recently. Please login again' });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
