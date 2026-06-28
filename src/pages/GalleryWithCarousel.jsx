import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';

function GalleryWithCarousel() {
    const [images, setImages] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        let isMounted = true;

        fetch('/api/images')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load images.');
                }

                return response.json();
            })
            .then((data) => {
                if (isMounted) {
                    setImages(Array.isArray(data) ? data : []);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setImages([]);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="section gallery-section">
            <ImageCarousel images={images} onImageClick={(url) => navigate("editorial/" + url)} />
        </section>
    );
}

export default GalleryWithCarousel;