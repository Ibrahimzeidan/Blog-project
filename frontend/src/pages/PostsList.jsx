import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

/**
 * PostsList page
 * --------------
 * Displays a paginated and filterable list of blog posts. Allows
 * filtering by status, author and tag, searching by title/slug/content
 * and sorting/pagination. The authors list is fetched to populate
 * the author dropdown. Actions include editing and deleting posts.
 */
function PostsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });

  // Extract query parameters with defaults
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';
  const status = searchParams.get('status') || '';
  const author = searchParams.get('author') || '';
  const tag = searchParams.get('tag') || '';
  const q = searchParams.get('q') || '';

  // Fetch authors for filter dropdown once on mount
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const res = await api.get('/api/authors', { params: { limit: 100 } });
        setAuthors(res.data.data);
      } catch (err) {
        // silently ignore author loading errors; list will be empty
      }
    };
    loadAuthors();
  }, []);

  // Fetch posts whenever query parameters change
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/posts', {
          params: {
            page,
            limit,
            sort,
            order,
            status: status || undefined,
            author: author || undefined,
            tag: tag || undefined,
            q: q || undefined,
          },
        });
        setPosts(res.data.data);
        setPageInfo({ page: res.data.page, totalPages: res.data.totalPages });
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load posts';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sort, order, status, author, tag, q]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/api/posts/${id}`);
      // Refresh current page
      const res = await api.get('/api/posts', {
        params: {
          page,
          limit,
          sort,
          order,
          status: status || undefined,
          author: author || undefined,
          tag: tag || undefined,
          q: q || undefined,
        },
      });
      setPosts(res.data.data);
      setPageInfo({ page: res.data.page, totalPages: res.data.totalPages });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete post';
      setError(message);
    }
  };

  // Helper to update search parameters
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

  // Pagination
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= pageInfo.totalPages) {
      updateParams({ page: newPage });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Link
          to="create"
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Create Post
        </Link>
      </div>
      {/* Filters */}
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
            placeholder="Search by title or content"
            className="border rounded px-3 py-2 w-48"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
            className="border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="author">
            Author
          </label>
          <select
            id="author"
            value={author}
            onChange={(e) => updateParams({ author: e.target.value, page: 1 })}
            className="border rounded px-3 py-2"
          >
            <option value="">All</option>
            {authors.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="tag">
            Tag
          </label>
          <input
            id="tag"
            type="text"
            value={tag}
            onChange={(e) => updateParams({ tag: e.target.value, page: 1 })}
            placeholder="Tag filter"
            className="border rounded px-3 py-2 w-32"
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
            <option value="title">Title</option>
            <option value="publishedAt">Published At</option>
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
      {/* Posts Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2 text-left text-sm font-medium">Title</th>
                <th className="border px-3 py-2 text-left text-sm font-medium">Author</th>
                <th className="border px-3 py-2 text-left text-sm font-medium">Status</th>
                <th className="border px-3 py-2 text-left text-sm font-medium">Created</th>
                <th className="border px-3 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-3 py-2">{post.title}</td>
                  <td className="border px-3 py-2">{post.author?.name || ''}</td>
                  <td className="border px-3 py-2 capitalize">{post.status}</td>
                  <td className="border px-3 py-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2 space-x-2">
                    <Link
                      to={`${post._id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
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
      {/* Pagination */}
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

export default PostsList;