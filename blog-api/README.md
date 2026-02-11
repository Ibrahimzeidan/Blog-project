# Blog Platform REST API (Admin-Managed)

Production-style RESTful API built with **Node.js + Express + TypeScript + MongoDB (Atlas)**.
This project models a real admin-managed backend where an admin creates and manages **Authors** and **Posts**.
Posts are linked to Authors using MongoDB ObjectId references.

## Features
- Full CRUD for Authors and Posts
- Relational data modeling (Post → Author)
- Filtering, sorting, pagination (GET all endpoints)
- Search with `q` on posts/authors
- Request validation (Zod)
- Centralized error handling
- Clean, scalable folder structure (controllers/routes/models/middlewares/utils)

## Tech Stack
- Node.js, Express
- TypeScript
- MongoDB Atlas + Mongoose
- Zod (validation)
- (Bonus) JWT Authentication

---

## Data Models

### Author
- `name`: string (required)
- `email`: string (required, unique)
- `bio`: string (optional)
- `createdAt`, `updatedAt`

### Post
- `title`: string (required)
- `slug`: string (required, unique)
- `content`: string (required)
- `status`: `"draft" | "published"` (default: `draft`)
- `tags`: string[] (optional)
- `author`: ObjectId (required, ref: Author) ✅ relation
- `publishedAt`: date (set when published)
- `createdAt`, `updatedAt`

---

## API Endpoints

### Health
- `GET /health`

### Authors
- `POST /api/authors` (admin)
- `GET /api/authors`
- `GET /api/authors/:id`
- `PATCH /api/authors/:id` (admin)
- `DELETE /api/authors/:id` (admin)

### Posts
- `POST /api/posts` (admin)
- `GET /api/posts`
- `GET /api/posts/:id`
- `PATCH /api/posts/:id` (admin)
- `DELETE /api/posts/:id` (admin)
- `GET /api/posts/author/:authorId`

---

## Query Examples (Filtering / Sorting / Pagination)

### Posts
- Pagination:
  - `GET /api/posts?page=1&limit=5`
- Filter by status:
  - `GET /api/posts?status=published`
- Filter by author:
  - `GET /api/posts?author=AUTHOR_ID`
- Filter by tag:
  - `GET /api/posts?tag=node`
- Sorting:
  - `GET /api/posts?sort=createdAt&order=desc`
- Search:
  - `GET /api/posts?q=express`

### Authors
- Pagination + sorting:
  - `GET /api/authors?page=1&limit=10&sort=createdAt&order=desc`
- Search:
  - `GET /api/authors?q=john`

---

## How to Run Locally

### 1) Install dependencies

npm install
