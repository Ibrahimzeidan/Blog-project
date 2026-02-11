/**
 * Post Service
 * ------------
 * Business logic and data access layer for Post resource.
 *
 * Responsibilities:
 * - Create, update, delete posts
 * - Automatically manage publishedAt field
 * - Apply advanced querying (filter, search, sort, paginate)
 * - Handle posts by specific author
 *
 * Notes:
 * - Uses ApiFeatures utility for reusable query logic
 * - Called by post.controller.ts
 */
import { Types } from "mongoose";
import { Post } from "../models/Post";
import { AppError } from "../utils/AppError";
import { ApiFeatures } from "../utils/apiFeatures";

export async function createPost(data: any) {
  const payload = { ...data };

  // auto publishedAt
  if (payload.status === "published" && !payload.publishedAt) payload.publishedAt = new Date();
  if (payload.status === "draft") payload.publishedAt = null;

  const post = await Post.create(payload);
  return Post.findById(post._id).populate("author", "name email");
}

export async function getPosts(query: any) {
  const baseQuery = Post.find().populate("author", "name email");

  const features = new ApiFeatures(baseQuery, query)
    .filter(["status", "author", "tag"])
    .search(["title", "content", "slug"])
    .sort("-createdAt")
    .paginate(10, 100);

  const countQuery = new ApiFeatures(Post.find(), query)
    .filter(["status", "author", "tag"])
    .search(["title", "content", "slug"]);

  const [total, posts] = await Promise.all([
    countQuery.query.countDocuments(),
    features.query,
  ]);

  return {
    page: features.page,
    limit: features.limit,
    total,
    totalPages: Math.max(Math.ceil(total / features.limit), 1),
    results: posts.length,
    data: posts,
  };
}

export async function getPostById(id: string) {
  const post = await Post.findById(id).populate("author", "name email");
  if (!post) throw new AppError("Post not found", 404);
  return post;
}

export async function updatePost(id: string, data: any) {
  const payload = { ...data };

  if (payload.status === "published") payload.publishedAt = new Date();
  if (payload.status === "draft") payload.publishedAt = null;

  const post = await Post.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("author", "name email");

  if (!post) throw new AppError("Post not found", 404);
  return post;
}

export async function deletePost(id: string) {
  const post = await Post.findByIdAndDelete(id);
  if (!post) throw new AppError("Post not found", 404);
  return post;
}

export async function getPostsByAuthor(authorId: string, query: any) {
  if (!Types.ObjectId.isValid(authorId)) throw new AppError("Invalid author id", 400);

  const authorObjectId = new Types.ObjectId(authorId);

  const baseQuery = Post.find({ author: authorObjectId }).populate("author", "name email");

  const features = new ApiFeatures(baseQuery, query)
    .filter(["status", "tag"])
    .search(["title", "content", "slug"])
    .sort("-createdAt")
    .paginate(10, 100);

  const countQuery = new ApiFeatures(Post.find({ author: authorObjectId }), query)
    .filter(["status", "tag"])
    .search(["title", "content", "slug"]);

  const [total, posts] = await Promise.all([
    countQuery.query.countDocuments(),
    features.query,
  ]);

  return {
    author: authorId,
    page: features.page,
    limit: features.limit,
    total,
    totalPages: Math.max(Math.ceil(total / features.limit), 1),
    results: posts.length,
    data: posts,
  };
}
