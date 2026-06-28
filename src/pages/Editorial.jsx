import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


function Editorial() {
    const { '*': editorialSlug } = useParams();
    const navigate = useNavigate();

    const editorialId = editorialSlug ? decodeURIComponent(editorialSlug) : '';
    const [images, setImages] = useState([]);
    const [content, setContent] = useState({title:""});

     function handleBack() {
        navigate(-1);
     }

    function createMarkup(content) {
        return {
            __html: content
        };
    }; 

    useEffect(() => {
        console.log("ed:", editorialId);
        if (!editorialId) {
            //setImages([]);
            return;
        }

        let isMounted = true;      

        fetch("/api/WordPress/" + editorialId)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load images.');
                }
                return response.json();
            }).then((data) => {
                console.log(data);
                setContent(data); 
                const items = Array.isArray(data.files) ? data.files : [];
                setImages(items);
            })
            .catch(() => {
                if (isMounted) {
                    setImages([]);
                }
            });
                
            /*
        fetch('/api/images')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load images.');
                }

                return response.json();
            })
            .then((data) => {
                if (isMounted) {
                    const items = Array.isArray(data) ? data : [];
                    setImages(items.filter((item) => item.url === editorialId));
                }
            })
            .catch(() => {
                if (isMounted) {
                    setImages([]);
                }
            });
            */

        return () => {
            isMounted = false;
            }
        } 
            , [editorialId]);

    return (
        <section className="section gallery-section">
          <button onClick={handleBack} className="back-button">
                &larr; Back
            </button>
            <div className="section-header">
                <h2>{content.title || 'Editorial'}</h2>
            </div>
            <div className="gallery-grid">
                {images.map((item, index) => (
                    <article key={`${item}-${index}`} className="gallery-image gallery-item">
                        <img className="gallery-image" src={item} alt={item} loading="lazy" />
                        <div dangerouslySetInnerHTML={createMarkup(content.content)} /> 
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Editorial;