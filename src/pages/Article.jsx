import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./stylesheets/Article.css"

function decodeHtml(value) {
    if (!value) {
        return '';
    }

    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.body.textContent ?? '';
}

function Article() {
    const { '*': id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        fetchArticle([id]);
    }, [id]);

    async function fetchArticle([id]) {
        try {
            setLoading(true);
            console.log("navigae",id);
            const [response, articlesResponse] = await Promise.all([
                fetch(`/api/articles/${id}`),
                fetch('/api/articles')
            ]);

            if (!response.ok) {
                throw new Error('Failed to fetch article');
            }

            const data = await response.text();
            let articleDetails = null;

            if (articlesResponse.ok) {
                const articles = await articlesResponse.json();
                articleDetails = Array.isArray(articles)
                    ? articles.find((item) => String(item.id) === String(id))
                    : null;
            }

            setArticle({ ...articleDetails, content: data });
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
        return <div className="loading">Loading article...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>Error: {error}</p>
                <button onClick={handleBack}>Go Back</button>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="not-found">
                <p>Article not found</p>
                <button onClick={handleBack}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="article-page">
            <button onClick={handleBack} className="back-button">
                &larr; Back
            </button>
            <article>
                <div className={`article-hero ${article.featuredImage ? '' : 'article-hero--empty'}`}>
                    {article.featuredImage && (
                        <img
                            className="article-hero-image"
                            src={`data:image/png;base64, ${article.featuredImage}`}
                            alt={decodeHtml(article.title)}
                        />
                    )}
                    <header className="article-header">
                        <h1>{decodeHtml(article.title)}</h1>
                        {article.author && <p className="author">By {article.author}</p>}
                        {article.publishedDate && (
                            <p className="date">
                                {new Date(article.publishedDate).toLocaleDateString()}
                            </p>
                        )}
                    </header>
                </div>
                <div className="article-content" dangerouslySetInnerHTML={{ __html:article.content }}>
                </div>
            </article>
        </div>
    );
}

export default Article;
