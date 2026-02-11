/**
 * Author Mongoose model.
 * Purpose: Defines Author schema (name, email, bio) and handles DB operations for authors.
 */
import { Schema, model } from "mongoose";

const authorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Author = model("Author", authorSchema);
