import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthorsList from './pages/AuthorsList';
import CreateAuthor from './pages/CreateAuthor';
import EditAuthor from './pages/EditAuthor';
import PostsList from './pages/PostsList';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

/**
 * App component
 * -------------
 * Defines the routing structure for the application. Public routes
 * include the login and register pages. All other routes are
 * wrapped in ProtectedRoute to ensure only authenticated users can
 * access them. Nested routes within the dashboard layout handle
 * listing, creation and editing of authors and posts.
 */
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect root of dashboard to authors list */}
        <Route index element={<Navigate to="authors" replace />} />
        {/* Authors management */}
        <Route path="authors" element={<AuthorsList />} />
        <Route path="authors/create" element={<CreateAuthor />} />
        <Route path="authors/:id/edit" element={<EditAuthor />} />
        {/* Posts management */}
        <Route path="posts" element={<PostsList />} />
        <Route path="posts/create" element={<CreatePost />} />
        <Route path="posts/:id/edit" element={<EditPost />} />
      </Route>
      {/* Redirect any unknown route to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;