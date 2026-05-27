import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import Admin from '../models/Admin.js';
import asyncWrapper from './asyncWrapper.js';

export const verifyToken = asyncWrapper(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) {
      throw new ApiError(401, 'Unauthorized: Admin user not found');
    }
    req.user = admin;
    next();
  } catch (error) {
    throw new ApiError(401, 'Unauthorized: Invalid or expired token');
  }
});
