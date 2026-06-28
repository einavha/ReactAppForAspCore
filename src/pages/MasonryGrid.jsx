import React, { useState, useEffect } from 'react';

const MasonryGrid = ({ posts, gap = 16, columnWidth = 300 }) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const calculateColumns = () => {
      // 1. Determine how many columns can fit in the window width
      const containerWidth = window.innerWidth;
      const columnCount = Math.max(1, Math.floor(containerWidth / (columnWidth + gap)));
      
      // 2. Create an array of arrays (one for each column)
      const newColumns = Array.from({ length: columnCount }, () => []);

      // 3. Distribute posts into columns
      // For a true masonry look, we place the next item in the shortest column
      // To keep it simple and performant, we can also use index % columnCount
      posts.forEach((post, index) => {
        newColumns[index % columnCount].push(post);
      });

      setColumns(newColumns);
    };

    calculateColumns();
    window.addEventListener('resize', calculateColumns);
    return () => window.removeEventListener('resize', calculateColumns);
  }, [posts, gap, columnWidth]);

  return (
    <div style={{ 
      display: 'flex', 
      gap: `${gap}px`, 
      padding: `${gap}px`,
      alignItems: 'flex-start' // Vital: keeps columns from stretching
    }}>
      {columns.map((column, colIndex) => (
        <div 
          key={colIndex} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: `${gap}px`, 
            flex: 1 
          }}
        >
          {column.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ))}
    </div>
  );
};

const PostCard = ({ post }) => (
  <div style={{
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  }}>
    {/* Use the provided height from your data */}
    <div style={{ 
      height: `${post.height}px`, 
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.8rem',
      color: '#888',
      width: `${post.width}px`
    }}>
      Image Placeholder ({post.width}x{post.height})
       <article className="post-card">
                {post.featuredImage && (
                    <img className="post-image" src={post.featuredImage} alt={post.title} />
                )}
                <h1 className="post-title">{post.title}</h1>
                {post.author && <p className="post-author">By {post.author}</p>}
                <p className="post-content">{post.content}</p>
            </article>
    </div>
    
  </div>
);

export default MasonryGrid;