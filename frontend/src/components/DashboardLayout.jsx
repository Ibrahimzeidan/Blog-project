import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

/**
 * DashboardLayout
 * ---------------
 * Provides a simple sidebar layout for the admin dashboard. The sidebar
 * contains navigation links to the authors and posts pages as well as
 * a logout button. The main area renders whatever child route is
 * currently active via the <Outlet> component from React Router.
 */
function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and user from storage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700 font-semibold' : ''}`;

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-800 text-white flex-shrink-0 p-4">
        <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
        <nav className="space-y-1">
          <NavLink to="authors" className={linkClass}>Authors</NavLink>
          <NavLink to="posts" className={linkClass}>Posts</NavLink>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;