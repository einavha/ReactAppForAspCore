import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheets/Magazine.css';
import Logo from '../components/Logo';

function decodeHtml(value) {
    if (!value) {
        return '';
    }
    
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.body.textContent ?? '';
}

function ArticleCard({ article, onReadMore }) {
    return (
        <articleCard className="article-card">
            <div className="article-title-row">
            {article.featuredImage ? (
                    <img
                        className="article-thumb"
                        src={`data:image/png;base64, ${article.featuredImage}`}
                        alt={decodeHtml(article.title)}
                        loading="lazy"
                    />
                ) : null}   
                <h2>{decodeHtml(article.title)}</h2>
                
            </div>
            {article.author ? <p className="article-author">מאת: {article.author}</p> : null}
            <p className="article-excerpt">{decodeHtml(article.excerpt)}</p>
            <button className="read-more" onClick={() => onReadMore(article)}>המשך לקרוא</button>
        </articleCard>
    );
}

function Magazine() {
    const [articles, setArticles] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {       
        fetchArticles();
    }, []);

    async function fetchArticles() {
        try {
            setLoading(true);
            const response = await fetch('/api/articles');
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const data = await response.json();
            setArticles(data);
            setImages(data.slice(0,4));
        } catch (err) {
            setArticles([]);
            setLoading(false);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="loading">Loading articles...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    const handleReadMore = (article) => {
        if (!article?.id) {
            return;
        }

        navigate(`/magazine/${article.id}`);
    };

    return (
        <div className="magazine">
            <div className="magazine-logo-wrap">
                <Logo />
            </div>
            <div className="images-grid">
                {images.length === 0 ? (
                    <p>No articles available.</p>
                ) : (
                     images.map((image, index) => (                        
                            <img className="img-card" key={index} src={"data:image/png;base64, " + image.featuredImage} loading="lazy" width="300px" />                      
                     ))
                )}
            </div>
            <div className="articles-grid">
                {articles.length === 0 ? (
                    <p>No articles available.</p>
                ) : (
                    articles.map((article) => (                        
                        <ArticleCard key={article.id} article={article} onReadMore={handleReadMore} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Magazine;