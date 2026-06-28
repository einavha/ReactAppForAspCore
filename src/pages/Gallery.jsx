import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useVantaClouds } from '../hooks/useVantaClouds.js';
import { SiteDirection, SiteName, TextAlignment } from '../config/site.jsx';


function Gallery() {
    const [images, setImages] = useState([]);
    const navigate = useNavigate();
    //const isVantaDisabled = true;
    
    
    const vantaOptions = useMemo(() => ({
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 1000.00,
        scale: 1.00,
        scaleMobile: 1.00,
        framerate: 10
    }), []);
    const { vantaRef, isVantaDisabled } = useVantaClouds(vantaOptions);
    const [headerScale, setHeaderScale] = useState(1); // Dynamic scale factor
    const [isHeaderAtTop, setIsHeaderAtTop] = useState(true);
    const navTransformOrigin = SiteDirection === 'rtl' ? 'right top' : 'left top';
    const titleTransformOrigin = SiteDirection === 'rtl' ? 'left top' : 'right top';
    const navDirection = SiteDirection === 'rtl' ? 'row-reverse' : 'row';
    const pageTitle = "טעות דפוס";

    const lastScrollYRef = useRef(0);

    
    useEffect(() => {
        if (isHeaderAtTop) { console.log(isHeaderAtTop) }
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsHeaderAtTop(currentScrollY === 0);

            // Define scroll thresholds for dynamic header scaling
            if (currentScrollY <= 50) {
                setHeaderScale(1); // Full size
            } else //if (currentScrollY <= 100) 
            {
                var scale = 1 - (currentScrollY - 50) / 100 * 0.3;  // Scale down to 80% at 150px
                console.log(scale);
                setHeaderScale(scale);
            }

            /*
            if (currentScrollY <= 150) {
                setHeaderScale(0.8); // 80% size
            } else {
                setHeaderScale(0.6); // 60% size
            }
            */

            lastScrollYRef.current = currentScrollY;
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        let isMounted = true;

        const loadImages = async () => {
            try {
                const config = await fetch("/config.json").then((response) => response.json());
                const api = config.apiUrl;
                const response = await fetch(`${api}/api/WordPress/list`);

                if (!response.ok) {
                    throw new Error('Failed to load images.');
                }

                const data = await response.json();
                console.log('Fetched images:', data);
                if (isMounted) {
                    setImages(Array.isArray(data) ? data : []);
                }
            } catch {
                if (isMounted) {
                    setImages([]);
                }
            }
        };

        loadImages();

        return () => {
            isMounted = false;
        };
    }, []);

    function encodeHTMLEntities(text) {
        var textArea = document.createElement('textarea');
        textArea.innerText = text;
        return textArea.innerHTML;
    }

    return (
        <>
        <div
            ref={vantaRef}
            className={`editorials-container clouds-hero gallery-clouds-hero ${isVantaDisabled ? 'clouds-hero--static' : ''}`}
        >
                <h2
                    className="h2special"
                    style={{
                        transform: `scale(${headerScale})`,
                        transformOrigin: titleTransformOrigin,
                        transition: 'transform 0.3s ease-out'
                    }}
                >
                    {pageTitle}
                </h2>
        </div>
        <section className="section gallery-section">
            <div className="gallery-grid">{images.map((item) =>
                <article key={item.fileName ?? item.title} className="gallery-item" onClick={() => navigate("editorial/" + item.slug)}>
                    <img src={item.mainImage} className="gallery-image" alt={item.title} loading="lazy" />
                    {item.title && item.title.length > 0 && (
                    <div className="gallery-body">
                        <div
                            className="gallery-post-link"
                            role="link"
                            tabIndex={0}
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/gallerypost/${item.id}`);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    navigate(`/gallerypost/${item.id}`);
                                }
                            }}
                        >
                                {encodeHTMLEntities(item.title)}
                            </div>
                        </div>)}
                </article>
            )}
            </div>
        </section >
          </>
    )
}

export default Gallery;
