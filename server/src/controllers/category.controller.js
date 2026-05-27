import Category from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';
import asyncWrapper from '../middleware/asyncWrapper.js';

export const getCategories = asyncWrapper(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({
    success: true,
    categories
  });
});

export const createCategory = asyncWrapper(async (req, res) => {
  const { name, color } = req.body;
  if (!name) {
    throw new ApiError(400, 'Category name is required');
  }
  const category = new Category({ name, color });
  await category.save();
  res.status(201).json({
    success: true,
    category
  });
});

export const updateCategory = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name, color },
    { new: true, runValidators: true }
  );
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  res.status(200).json({
    success: true,
    category
  });
});

export const deleteCategory = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});
