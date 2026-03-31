import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from "../models/User.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: 'Not authorized, please login to access this route' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded) return res.status(401).json({ message: 'Unauthorized - Invalid token' });

    console.log('decoded', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'The user belonging to this token no longer exists' })
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
