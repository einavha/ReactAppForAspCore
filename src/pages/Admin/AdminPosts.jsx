import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import './AdminPosts.css';
import { SiteDirection } from '../../config/site.jsx';

const emptyForm = {
    id: '',
    title: '',
    author: '',
    featuredImage: '',
    content: ''
};

function AdminPosts() {
    const { setPageTitle } = useOutletContext();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        setPageTitle('Admin');
        loadPosts();
    }, [setPageTitle]);

    const selectedPost = useMemo(
        () => posts.find((post) => String(post.id) === String(selectedId)),
        [posts, selectedId],
    );

    useEffect(() => {
        if (!selectedPost) {
            return;
        }

        setForm({
            id: selectedPost.id ?? '',
            title: selectedPost.title ?? '',
            author: selectedPost.author ?? '',
            featuredImage: selectedPost.featuredImage ?? '',
            content: selectedPost.content ?? ''
        });
    }, [selectedPost]);

    async function loadPosts() {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('/api/posts');

            if (!response.ok) {
                throw new Error(`Failed to load posts: ${response.status}`);
            }

            const data = await response.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    }

    function startCreate() {
        setSelectedId('');
        setForm(emptyForm);
        setStatusMessage('Creating a new post');
    }

    function handleSelect(postId) {
        setSelectedId(String(postId));
        setStatusMessage('');
    }

    function handleFormChange(event) {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    }

    async function handleSave(event) {
        event.preventDefault();

        if (!form.title.trim() || !form.content.trim()) {
            setStatusMessage('Title and content are required.');
            return;
        }

        const isEditing = Boolean(selectedId);
        const postId = isEditing ? selectedId : form.id.trim();

        if (!postId) {
            setStatusMessage('Post id is required for new posts.');
            return;
        }

        const payload = {
            id: postId,
            title: form.title.trim(),
            author: form.author.trim(),
            featuredImage: form.featuredImage.trim(),
            content: form.content.trim()
        };

        try {
            setSaving(true);
            setStatusMessage('Saving...');

            const endpoint = isEditing ? `/api/posts/${postId}` : '/api/posts';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Failed to save post: ${response.status}`);
            }

            await loadPosts();
            setSelectedId(String(postId));
            setStatusMessage('Post saved successfully.');
        } catch (err) {
            setStatusMessage(err.message || 'Failed to save post');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!selectedId) {
            return;
        }

        const confirmed = window.confirm('Delete this post? This action cannot be undone.');
        if (!confirmed) {
            return;
        }

        try {
            setSaving(true);
            setStatusMessage('Deleting...');

            const response = await fetch(`/api/posts/${selectedId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete post: ${response.status}`);
            }

            setSelectedId('');
            setForm(emptyForm);
            await loadPosts();
            setStatusMessage('Post deleted successfully.');
        } catch (err) {
            setStatusMessage(err.message || 'Failed to delete post');
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="admin-posts" dir={SiteDirection}>
            <div className="admin-posts__header">
                <h2>Post Admin</h2>
                <button type="button" onClick={startCreate} disabled={saving}>
                    New Post
                </button>
            </div>

            {error && <p className="admin-posts__error">{error}</p>}
            {statusMessage && <p className="admin-posts__status">{statusMessage}</p>}

            <div className="admin-posts__layout">
                <aside className="admin-posts__list">
                    <h3>Posts</h3>
                    {loading ? (
                        <p>Loading posts...</p>
                    ) : posts.length === 0 ? (
                        <p>No posts found.</p>
                    ) : (
                        <ul>
                            {posts.map((post) => (
                                <li key={post.id}>
                                    <button
                                        type="button"
                                        className={String(post.id) === String(selectedId) ? 'is-active' : ''}
                                        onClick={() => handleSelect(post.id)}>
                                        <span>{post.title || 'Untitled'}</span>
                                        <small>#{post.id}</small>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>

                <form className="admin-posts__form" onSubmit={handleSave}>
                    <label htmlFor="id">ID</label>
                    <input
                        id="id"
                        name="id"
                        value={form.id}
                        onChange={handleFormChange}
                        disabled={Boolean(selectedId)}
                        required={!selectedId}
                    />

                    <label htmlFor="title">Title</label>
                    <input id="title" name="title" value={form.title} onChange={handleFormChange} required />

                    <label htmlFor="author">Author</label>
                    <input id="author" name="author" value={form.author} onChange={handleFormChange} />

                    <label htmlFor="featuredImage">Featured Image URL</label>
                    <input
                        id="featuredImage"
                        name="featuredImage"
                        value={form.featuredImage}
                        onChange={handleFormChange}
                    />

                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        rows={10}
                        value={form.content}
                        onChange={handleFormChange}
                        required
                    />

                    <div className="admin-posts__actions">
                        <button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Post'}
                        </button>
                        <button type="button" onClick={handleDelete} disabled={saving || !selectedId}>
                            Delete Post
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default AdminPosts;
