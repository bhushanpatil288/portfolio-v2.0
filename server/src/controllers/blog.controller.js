import BlogPost from '../models/BlogPost.js';
import { ApiError } from '../utils/ApiError.js';
import asyncWrapper from '../middleware/asyncWrapper.js';

export const getBlogPosts = asyncWrapper(async (req, res) => {
  const { published, limit } = req.query;
  const filter = {};

  if (published !== undefined) {
    filter.published = published === 'true';
  }

  let query = BlogPost.find(filter).sort({ publishedAt: -1, createdAt: -1 });

  if (limit) {
    query = query.limit(parseInt(limit, 10));
  }

  const posts = await query;
  res.status(200).json({
    success: true,
    posts
  });
});

export const getBlogPostBySlug = asyncWrapper(async (req, res) => {
  const { slug } = req.params;
  const post = await BlogPost.findOne({ slug });
  if (!post) {
    throw new ApiError(404, 'Blog post not found');
  }
  res.status(200).json({
    success: true,
    post
  });
});

export const createBlogPost = asyncWrapper(async (req, res) => {
  const post = new BlogPost(req.body);
  await post.save();
  res.status(201).json({
    success: true,
    post
  });
});

export const updateBlogPost = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const post = await BlogPost.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  if (!post) {
    throw new ApiError(404, 'Blog post not found');
  }
  res.status(200).json({
    success: true,
    post
  });
});

export const deleteBlogPost = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const post = await BlogPost.findByIdAndDelete(id);
  if (!post) {
    throw new ApiError(404, 'Blog post not found');
  }
  res.status(200).json({
    success: true,
    message: 'Blog post deleted successfully'
  });
});

export const getBlogPostById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const post = await BlogPost.findById(id);
  if (!post) {
    throw new ApiError(404, 'Blog post not found');
  }
  res.status(200).json({
    success: true,
    post
  });
});
