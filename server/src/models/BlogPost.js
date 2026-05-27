import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String
  },
  tags: [String],
  coverImage: {
    url: String,
    publicId: String
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

blogPostSchema.pre('save', async function (next) {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (!this.isModified('title') && this.slug) return next();

  let baseSlug = slugify(this.title);
  let finalSlug = baseSlug;

  const existing = await mongoose.models.BlogPost.findOne({ slug: finalSlug, _id: { $ne: this._id } });
  if (existing) {
    finalSlug = `${baseSlug}-${Date.now()}`;
  }

  this.slug = finalSlug;
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
