# Blog Admin Frontend

This project is a simple admin dashboard frontend built with React, Vite and Tailwind CSS. It connects to the `blog-api` backend to manage authors and posts. The application implements authentication using JWT tokens, protected routes, resource listing with filtering/sorting/pagination, and full CRUD operations for authors and posts.

## Features

- **Authentication**: Register and login pages allow admins to create an account and obtain a JWT. The token is saved to `localStorage` and sent with every API request.
- **Protected Routes**: All dashboard pages require a valid token; users are redirected to the login page otherwise.
- **Dashboard Layout**: A responsive sidebar layout with navigation links to authors and posts as well as a logout button.
- **Authors Management**: List authors with search, sorting and pagination; create, edit and delete authors.
- **Posts Management**: List posts with filters for status, author and tag, plus search, sorting and pagination; create, edit and delete posts. Posts include fields for title, slug, content, status, tags and author relation.
- **Error & Loading Handling**: Each page shows loading states during API calls and displays error messages returned from the backend.

## Getting Started

### Prerequisites

To run this project locally you need a recent version of [Node.js](https://nodejs.org/) and npm installed. You also need the `blog-api` backend running on your machine or accessible over the network.

### Installation

1. Clone this repository or copy the `frontend` folder into your own project.
2. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. Create a `.env` file at the root of the `frontend` folder and set the base URL of your backend API. For example:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

   If you omit this file the app defaults to `http://localhost:3000`.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Vite will compile the project and serve it at `http://localhost:5173` by default. Open this URL in your browser to interact with the dashboard.

5. Build for production:

   ```bash
   npm run build
   ```

   The compiled output will be written to the `dist` folder. You can preview the production build locally with `npm run preview`.

## Environment Variables

The application reads a single environment variable at build time:

- `VITE_API_URL` – the base URL of your backend API (defaults to `http://localhost:3000`). All API requests are prefixed with this URL.

## Folder Structure

```
frontend/
├── index.html             # HTML entry point for Vite
├── package.json           # Project configuration and scripts
├── postcss.config.js      # PostCSS plugins (Tailwind + Autoprefixer)
├── tailwind.config.js     # Tailwind configuration
├── src/
│   ├── api.js             # Axios instance with authorization interceptor
│   ├── main.jsx           # Entry point that mounts the React app
│   ├── index.css          # Tailwind directives
│   ├── App.jsx            # Routes configuration
│   ├── components/
│   │   ├── DashboardLayout.jsx  # Layout with sidebar navigation
│   │   └── ProtectedRoute.jsx   # Wrapper that guards protected routes
│   └── pages/
│       ├── Login.jsx      # Login form
│       ├── Register.jsx   # Registration form
│       ├── AuthorsList.jsx# Authors listing with filters
│       ├── CreateAuthor.jsx# Author creation form
│       ├── EditAuthor.jsx# Author editing form
│       ├── PostsList.jsx  # Posts listing with filters
│       ├── CreatePost.jsx # Post creation form
│       └── EditPost.jsx   # Post editing form
└── README.md              # Project documentation
```

## Screenshots

Add screenshots here to demonstrate the working pages (optional).

## License

This project is provided as‑is for educational purposes.