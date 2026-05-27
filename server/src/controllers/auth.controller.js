import Admin from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';
import asyncWrapper from '../middleware/asyncWrapper.js';

export const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password');
  }

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  generateToken(res, admin._id);

  res.status(200).json({
    success: true,
    user: {
      id: admin._id,
      email: admin.email
    }
  });
});

export const getMe = asyncWrapper(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email
    }
  });
});

export const logout = asyncWrapper(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
