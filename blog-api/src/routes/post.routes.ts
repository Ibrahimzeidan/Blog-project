/**
 * Post routes.
 * Purpose: Maps /api/posts endpoints to controller functions + validation middleware.
 * Includes nested-like route: GET /api/posts/author/:authorId
 */
import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
  getPostsByAuthor
} from "../controllers/post.controller";
import { validate } from "../middlewares/validate";
import { createPostSchema, updatePostSchema } from "../middlewares/schemas";
import { idParamSchema, authorIdParamSchema } from "../middlewares/ids";

const router = Router();


router.post("/", validate(createPostSchema), createPost);
router.get("/", getPosts);
router.get("/author/:authorId", validate(authorIdParamSchema), getPostsByAuthor);
router.get("/:id", validate(idParamSchema), getPostById);
//router.patch("/:id", validate(idParamSchema), validate(updatePostSchema), updatePost);
//router.delete("/:id", validate(idParamSchema), deletePost);

import { protect, adminOnly } from "../middlewares/auth";

router.post("/", protect, adminOnly, validate(createPostSchema), createPost);
router.patch("/:id", protect, adminOnly, validate(idParamSchema), validate(updatePostSchema), updatePost);
router.delete("/:id", protect, adminOnly, validate(idParamSchema), deletePost);

export default router;
