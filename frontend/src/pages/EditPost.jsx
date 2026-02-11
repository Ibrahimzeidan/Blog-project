import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

/**
 * EditPost page
 * -------------
 * Allows the admin to edit an existing post. The form is pre-filled
 * with the current post data loaded from the API. After submitting
 * the updated information, the admin is redirected back to the
 * posts list.
 */
function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load authors list
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const res = await api.get('/api/authors', { params: { limit: 100 } });
        setAuthors(res.data.data);
      } catch (err) {
        // ignore authors load errors
      }
    };
    loadAuthors();
  }, []);

  // Load post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${id}`);
        const post = res.data.data;
        setTitle(post.title || '');
        setSlug(post.slug || '');
        setContent(post.content || '');
        setStatus(post.status || 'draft');
        setTags((post.tags || []).join(', '));
        setAuthor(post.author?._id || '');
        setLoading(false);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load post';
        setError(message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/api/posts/${id}`, {
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
      const message = err.response?.data?.message || 'Failed to update post';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
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
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}

export default EditPost;