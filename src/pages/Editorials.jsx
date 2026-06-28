import { useState, useEffect, useMemo } from 'react';

import { useVantaClouds } from '../hooks/useVantaClouds.js';

function Editorials() {
    const [editorials, setEditorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const vantaOptions = useMemo(() => ({
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00
    }), []);
    const { vantaRef, isVantaDisabled } = useVantaClouds(vantaOptions);

    useEffect(() => {
        fetchEditorials();
    }, []);

    async function fetchEditorials() {
        try {
            const response = await fetch('/api/WordPress/list');
            if (!response.ok) {
                throw new Error('Failed to fetch editorials');
            }
            const data = await response.json();
            setEditorials(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            ref={vantaRef}
            className={`editorials-container clouds-hero ${isVantaDisabled ? 'clouds-hero--static' : ''}`}
            style={{ height: '500px' }}
        >
        {loading && <div className="editorials-loading">Loading editorials...</div>}
        {error && <div className="editorials-error">Error: {error}</div>}
        {!loading && !error && <>
            <h1>Editorials</h1>
            <div className="editorials-list">
                {editorials.length === 0 ? (
                    <p>No editorials available.</p>
                ) : (
                    editorials.map((editorial) => (
                        <article key={editorial.id} className="editorial-item">
                            <h2>{editorial.title}</h2>
                            <p className="editorial-author">By {editorial.author}</p>
                            <p className="editorial-date">
                                {new Date(editorial.publishedDate).toLocaleDateString()}
                            </p>
                            <p className="editorial-excerpt">{editorial.excerpt}</p>
                            <a href={`/editorials/${editorial.id}`} className="editorial-link">
                                Read more
                            </a>
                        </article>
                    ))
                )}
            </div>
        </>}
        </div>
    );
}

export default Editorials;
