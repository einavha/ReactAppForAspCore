import { useState, useEffect, useRef } from 'react';
import PostSquare from './PostSquare.jsx';

const DynamicPostLayout = ({ posts }) => {
    const [layout, setLayout] = useState([]);
    const containerRef = useRef(null);

    // Calculate positions dynamically
    const calculateLayout = (posts, containerWidth) => {
        if (!containerWidth || !posts.length) return [];

        const positions = [];
        const rows = []; // Track available space in each row
        const gap = 20;

        posts.forEach((post) => {
            const postWidth = post.width || 400;
            const postHeight = post.height || 400;

            let placed = false;
            let targetX = 0;
            let targetY = 0;
            
            // Try to find space in existing rows first (fill gaps)
            for (let rowIndex = 0; rowIndex < rows.length && !placed; rowIndex++) {
                const row = rows[rowIndex];
                
                // Check if post fits in this row
                if (row.remainingWidth >= postWidth + gap) {
                    targetX = containerWidth - row.remainingWidth;
                    targetY = row.y; // Use the row's stored Y position
                    
                    // Update row info
                    row.remainingWidth -= (postWidth + gap);
                    row.maxHeight = Math.max(row.maxHeight, postHeight);
                    
                    placed = true;
                }
            }

            // If no space found in existing rows, create new row
            if (!placed) {
                targetX = gap;
                
                // Calculate Y position for new row
                targetY = rows.length > 0 
                    ? rows.reduce((sum, row) => sum + row.maxHeight + gap, gap)
                    : gap;
                
                // Create new row
                rows.push({
                    ...post,
                    remainingWidth: containerWidth - postWidth - (gap * 2),
                    maxHeight: postHeight,
                    y: targetY // Store Y position in the row
                });
            }

            positions.push({
                ...post,
                x: targetX,
                y: targetY,
                width: postWidth,
                height: postHeight
            });
        });

        //after placing all posts, ensure each post is next to the upper post in the row above it, by updating Y positions of posts in each row to match the row's Y position
        positions.forEach((pos) => {
            const row = rows.find(r => r.id === pos.id);
            const rowIndex = rows.indexOf(row);
            // find the post in the row above this post, and set this post's Y position to be the same as that post's Y position + that post's height + gap
            if (row && rowIndex > 0) {
                const upperRow = rows[rowIndex - 1];
                pos.y = upperRow.y + upperRow.maxHeight + gap;
            }
            if (row) {
                pos.y = row.y; // Ensure posts in this row are aligned to the row's Y position
            }
        });

        return positions;
    };

    // Update layout when posts or container size changes
    useEffect(() => {
        if (containerRef.current) {
                const updateLayout = () => {
                    const width = containerRef.current.offsetWidth;
                    setLayout(calculateLayout(posts, width));
                };

            updateLayout();

            const resizeObserver = new ResizeObserver(updateLayout);
            resizeObserver.observe(containerRef.current);

            return () => resizeObserver.disconnect();
        }
    }, [posts]);

    // Recalculate on window resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setLayout(calculateLayout(posts, width));
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [posts]);

    // Calculate total container height
    const containerHeight = layout.length > 0 
        ? Math.max(...layout.map(item => item.y + item.height)) + 20
        : 0;

    return (
        <div
            ref={containerRef} 
            style={{ 
                position: 'relative', 
                width: '100%', 
                height: `${containerHeight}px`,
                minHeight: '200px'
            }}
        >
            {layout.map((item, index) => (
                <div id={`div${item.id}`}
                    key={item.id || index}
                    style={{
                        position: 'absolute',
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        transition: 'all 0.3s ease' // Smooth repositioning
                    }}
                >
                    <PostSquare
                        id={item.id}
                        width={item.width}
                        height={item.height}
                        title={item.title}
                        description={item.content}
                        imageSrc={item.featuredImage}
                        imageAlt={item.title}
                    />
                </div>
            ))}
        </div>
    );
};

export default DynamicPostLayout;
