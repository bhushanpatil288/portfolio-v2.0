import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/projects.routes.js';
import profileRoutes from './routes/profile.routes.js';
import blogRoutes from './routes/blog.routes.js';
import categoryRoutes from './routes/categories.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import contactRoutes from './routes/contact.routes.js';

import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static uploads
app.use(express.static('public'));

// Register endpoints
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

app.use('/api/*', (req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

app.use(errorHandler);

export default app;
