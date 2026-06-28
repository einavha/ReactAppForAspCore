import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SiteName } from '../config/site.jsx';

function News() {
    const { setPageTitle } = useOutletContext();
    useEffect(() => { setPageTitle(''); }, [setPageTitle]);

    return (
        <section className="section">
            <div className="section-header">
                <h1>News</h1>
                <p>Latest updates across culture, design, and travel.</p>
            </div>
            <p>Explore the newest stories and curated updates from {SiteName}.</p>
        </section>
    );
}

export default News;
