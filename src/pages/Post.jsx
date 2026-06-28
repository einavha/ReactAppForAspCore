import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './stylesheets/Post.css';
import { SiteDirection } from '../config/site.jsx';

function Post() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost(id);
    }, [id]);

    async function fetchPost(postId) {
        try {
            setLoading(true);
            const response = await fetch(`/api/posts/${postId}`);
            if (response.status === 404) {
                setPost(null);
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }
            const data = await response.json();
            setPost(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleBack() {
        navigate(-1);
    }

    if (loading) {
        return <div className="loading">Loading post...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>Error: {error}</p>
                <button onClick={handleBack}>Go Back</button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="not-found">
                <p>Post not found</p>
                <button onClick={handleBack}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="post-page" dir={SiteDirection}>
            <button onClick={handleBack} className="back-button">
                &larr; Back
            </button>
            <article className="post-card">
                {post.featuredImage && (
                    <img className="post-image" src={post.featuredImage} alt={post.title} />
                )}
                <h1 className="post-title">{post.title}</h1>
                {post.author && <p className="post-author">By {post.author}</p>}
                <p className="post-content">{post.content}</p>
            </article>
        </div>
    );
}

export default Post;
