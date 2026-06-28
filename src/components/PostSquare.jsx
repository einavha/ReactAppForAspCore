import { useNavigate } from 'react-router-dom';

const PostSquare = ({ id, width, height, title, description, imageSrc, imageAlt }) => {
    const navigate = useNavigate();
    const toSize = (value) => (typeof value === 'number' ? `${value}px` : value);

    const containerStyle = {
        width: toSize(width),
        height: toSize(height),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '10px',
        border: '1px solid #e7e2da',
        background: '#ffffff',
        padding: '12px',
        boxSizing: 'border-box',
        cursor: id ? 'pointer' : 'default'
    };

    const imageStyle = {
        width: '100%',
        height: '60%',
        objectFit: 'cover'
    };

    const textStyle = {
        margin: 0,
        textAlign: 'start'
    };

    const handleOpen = () => {
        if (!id) {
            return;
        }

        navigate(`/posts/${id}`);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOpen();
        }
    };

    return (
        <div
            className="post-square"
            style={containerStyle}
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            role={id ? 'button' : undefined}
            tabIndex={id ? 0 : undefined}
            aria-label={id ? `Open post ${title}` : undefined}>
            <img src={imageSrc} alt={imageAlt || title} style={imageStyle} />
            <h3 style={textStyle}>{title}</h3>
            <p style={textStyle}>{description}</p>
        </div>
    );
};

export default PostSquare;