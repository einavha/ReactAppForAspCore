import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import StaticGrid from './StaticGrid.jsx';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { setPageTitle } = useOutletContext();

    useEffect(() => {
        setPageTitle('טעות דפוס');
        fetchPosts();
    }, [setPageTitle]);

    async function fetchPosts() {
        try {
            setLoading(true);
            const response = await fetch('/api/posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="posts-container"><p>Loading posts...</p></div>;
    }

    if (error) {
        return <div className="posts-container"><p className="error">Error: {error}</p></div>;
    }

    return (
        /*
        <div className="posts-container" dir="rtl">
            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                <MasonryGrid posts={posts} />
            )}
        </div>
        */
       <StaticGrid posts={posts} />
    );
}

export default Posts;
