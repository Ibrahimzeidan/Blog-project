import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

/**
 * AuthorsList page
 * ----------------
 * Displays a paginated and filterable list of authors. The query
 * parameters used for pagination, sorting and filtering are stored
 * in the URL via useSearchParams which allows the page to be
 * shareable/bookmarkable. Clicking on edit or delete triggers the
 * appropriate API calls. On deletion the list refreshes.
 */
function AuthorsList() {
  // Search parameters stored in the URL for shareable links
  const [searchParams, setSearchParams] = useSearchParams();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });

  // Extract query parameters or set defaults
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const q = searchParams.get('q') || '';

  // Fetch authors whenever query params change
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/authors', {
          params: {
            page,
            limit,
            sort,
            order,
            q: q || undefined,
          },
        });
        setAuthors(res.data.data);
        setPageInfo({ page: res.data.page, totalPages: res.data.totalPages });
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load authors';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sort, order, q]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this author?')) return;
    try {
      await api.delete(`/api/authors/${id}`);
      // After deletion, refetch current page
      const res = await api.get('/api/authors', {
        params: { page, limit, sort, order, q: q || undefined },
      });
      setAuthors(res.data.data);
      setPageInfo({ page: res.data.page, totalPages: res.data.totalPages });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete author';
      setError(message);
    }
  };

  // Update search params helper
  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    setSearchParams(newParams);
  };

  // Handle page changes
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= pageInfo.totalPages) {
      updateParams({ page: newPage });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Authors</h2>
        <Link
          to="create"
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Create Author
        </Link>
      </div>
      {/* Filter & sort controls */}
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={q}
            onChange={(e) => updateParams({ q: e.target.value, page: 1 })}
            placeholder="Search by name or email"
            className="border rounded px-3 py-2 w-48"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="createdAt">Created At</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="order">
            Order
          </label>
          <select
            id="order"
            value={order}
            onChange={(e) => updateParams({ order: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="limit">
            Per page
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => updateParams({ limit: e.target.value, page: 1 })}
            className="border rounded px-3 py-2"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
      {/* Data table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : authors.length === 0 ? (
        <p>No authors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2 text-left text-sm font-medium">Name</th>
                <th className="border px-3 py-2 text-left text-sm font-medium">Email</th>
                <th className="border px-3 py-2 text-left text-sm font-medium">Created</th>
                <th className="border px-3 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author._id} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-3 py-2">{author.name}</td>
                  <td className="border px-3 py-2">{author.email}</td>
                  <td className="border px-3 py-2">
                    {new Date(author.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2 space-x-2">
                    <Link
                      to={`${author._id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(author._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={pageInfo.page <= 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pageInfo.page} of {pageInfo.totalPages}
        </span>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={pageInfo.page >= pageInfo.totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AuthorsList;