import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

/**
 * EditAuthor page
 * ---------------
 * Allows the admin to edit an existing author's details. The form
 * is pre-filled with the current values fetched from the API. On
 * submission the changes are sent via a PATCH request and the user
 * is redirected back to the authors list.
 */
function EditAuthor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await api.get(`/api/authors/${id}`);
        const author = res.data.data;
        setName(author.name || '');
        setEmail(author.email || '');
        setBio(author.bio || '');
        setLoading(false);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load author';
        setError(message);
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/api/authors/${id}`, { name, email, bio: bio || undefined });
      navigate('/dashboard/authors');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update author';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Author</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="bio">
            Bio (optional)
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2"
          ></textarea>
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

export default EditAuthor;