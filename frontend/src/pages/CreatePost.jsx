import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * CreatePost page
 * ---------------
 * Presents a form for creating a new post. Fields include title,
 * slug, content, status, tags (comma separated) and author. On
 * successful creation the user is redirected back to the posts list.
 */
function CreatePost() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load authors on mount to populate the select
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const res = await api.get('/api/authors', { params: { limit: 100 } });
        setAuthors(res.data.data);
      } catch (err) {
        // ignore author loading errors
      }
    };
    loadAuthors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/posts', {
        title,
        slug,
        content,
        status,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t),
        author,
      });
      navigate('/dashboard/posts');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create post';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[10rem]">
            <label className="block text-sm mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex-1 min-w-[10rem]">
            <label className="block text-sm mb-1" htmlFor="author">
              Author
            </label>
            <select
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select author</option>
              {authors.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[10rem]">
            <label className="block text-sm mb-1" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;