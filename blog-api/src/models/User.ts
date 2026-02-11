/**
 * User Mongoose model (BONUS - JWT auth).
 * Purpose: Stores admin/user credentials for login (hashed password) and role-based access.
 */
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["admin", "user"], default: "admin" } // admin-only system
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
