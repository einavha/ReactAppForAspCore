import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './stylesheets/imageCarousel.css';

const ImageCarousel = ({ images, autoPlayInterval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying || !images || images.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [isAutoPlaying, images, autoPlayInterval]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const toggleAutoPlay = () => {
        setIsAutoPlaying((prev) => !prev);
    };

    if (!images || images.length === 0) {
        return <div className="carousel-empty">No images to display</div>;
    }

    return (
        <div className="carousel-container">
            <div className="carousel-wrapper">
                <button
                    className="carousel-button carousel-button-prev"
                    onClick={goToPrevious}
                    aria-label="Previous image"
                >
                    &#8249;
                </button>

                <div className="carousel-image-container">
                    <img
                        src={images[currentIndex].content}
                        alt={images[currentIndex].alt || `Slide ${currentIndex + 1}`}
                        className="carousel-image"
                    />
                </div>

                <button
                    className="carousel-button carousel-button-next"
                    onClick={goToNext}
                    aria-label="Next image"
                >
                    &#8250;
                </button>
            </div>

            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-indicator ${
                            index === currentIndex ? 'active' : ''
                        }`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="carousel-controls">
                <button
                    className="carousel-control-button"
                    onClick={toggleAutoPlay}
                    aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                    {isAutoPlaying ? 'Pause' : 'Play'}
                </button>
                <span className="carousel-counter">
                    {currentIndex + 1} / {images.length}
                </span>
            </div>
        </div>
    );
};

ImageCarousel.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
            alt: PropTypes.string,
        })
    ).isRequired,
    autoPlayInterval: PropTypes.number,
};

export default ImageCarousel;
