import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function GalleryPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchPost() {
            try {
                setLoading(true);
                setError(null);

                const listResponse = await fetch('/api/WordPress/list');
                if (!listResponse.ok) {
                    throw new Error('Failed to load WordPress posts.');
                }

                const posts = await listResponse.json();
                const matchedPost = Array.isArray(posts)
                    ? posts.find((item) => String(item.id) === String(id) || String(item.slug) === String(id))
                    : null;

                if (!matchedPost) {
                    setPost(null);
                    return;
                }

                const detailResponse = await fetch(`/api/WordPress/${matchedPost.slug}`);
                if (!detailResponse.ok) {
                    throw new Error('Failed to load WordPress post.');
                }

                const detail = await detailResponse.json();

                if (isMounted) {
                    setPost({ ...matchedPost, ...detail });
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchPost();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return <div className="loading">Loading post...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>Error: {error}</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="not-found">
                <p>Post not found</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <section className="gallery-post-page">
            <button onClick={() => navigate(-1)} className="back-button">
                &larr; Back
            </button>
            <article className="gallery-post">
                {post.mainImage && (
                    <div className="gallery-post-hero">
                        <img src={post.mainImage} alt={post.title} />
                        <header className="gallery-post-header">
                            <h1>{post.title}</h1>
                        </header>
                    </div>
                )}
                {!post.mainImage && (
                    <header className="gallery-post-header gallery-post-header--static">
                        <h1>{post.title}</h1>
                    </header>
                )}
                {post.content ? (
                    <div
                        className="gallery-post-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                ) : (
                    post.description && <p className="gallery-post-description">{post.description}</p>
                )}
            </article>
        </section>
    );
}

export default GalleryPost;
