/**
 * Express app configuration.
 * Purpose: Register global middlewares, routes, 404 handler, and error handler.
 * Note: `app` is exported and used by server.ts.
 */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

/* -------------------- Global Middlewares -------------------- */

// Enable CORS (so Postman / frontend can access API)
app.use(cors());

// Logger for development
app.use(morgan("dev"));

// Parse incoming JSON
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));


/* -------------------- Health Check Route -------------------- */

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});


/* -------------------- API Routes (we will add later) -------------------- */

import authorRoutes from "./routes/author.routes";
app.use("/api/authors", authorRoutes);

import postRoutes from "./routes/post.routes";

app.use("/api/posts", postRoutes);

import authRoutes from "./routes/auth.routes";
app.use("/api/auth", authRoutes);

/* -------------------- 404 Handler -------------------- */

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});




/* -------------------- Global Error Handler -------------------- */

app.use(errorHandler);
