/**
 * Author Service
 * --------------
 * Business logic and data access layer for Author resource.
 *
 * Responsibilities:
 * - Interact with Author model (MongoDB)
 * - Apply filtering, searching, sorting, and pagination
 * - Throw application-level errors when needed (e.g., not found)
 *
 * Notes:
 * - Called by author.controller.ts
 * - Does NOT know anything about HTTP (req/res)
 */
import { Author } from "../models/Author";
import { AppError } from "../utils/AppError";
import { ApiFeatures } from "../utils/apiFeatures";

export async function createAuthor(data: any) {
  return Author.create(data);
}

export async function getAuthors(query: any) {
  const baseQuery = Author.find();

  const features = new ApiFeatures(baseQuery, query)
    .filter(["name", "email"])
    .search(["name", "email"])
    .sort("-createdAt")
    .paginate(10, 100);

  const countQuery = new ApiFeatures(Author.find(), query)
    .filter(["name", "email"])
    .search(["name", "email"]);

  const [total, authors] = await Promise.all([
    countQuery.query.countDocuments(),
    features.query,
  ]);

  return {
    page: features.page,
    limit: features.limit,
    total,
    totalPages: Math.max(Math.ceil(total / features.limit), 1),
    results: authors.length,
    data: authors,
  };
}

export async function getAuthorById(id: string) {
  const author = await Author.findById(id);
  if (!author) throw new AppError("Author not found", 404);
  return author;
}

export async function updateAuthor(id: string, data: any) {
  const author = await Author.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!author) throw new AppError("Author not found", 404);
  return author;
}

export async function deleteAuthor(id: string) {
  const author = await Author.findByIdAndDelete(id);
  if (!author) throw new AppError("Author not found", 404);
  return author;
}
