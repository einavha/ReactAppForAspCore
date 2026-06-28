import React, { useEffect, useState } from 'react';
import './stylesheets/StaticGrid.css';
import headlineImage from './headline.png';

const fallbackGridItems = [
  { id: '1', label: '1', className: 'grid-item-vertical-span' },
  { id: '2', label: '2', className: 'grid-item-span' },
  { id: '5', label: '5' },
  { id: '6', label: '6' },
  { id: '7', label: '7' },
  { id: '8', label: '8' },
  { id: '9', label: '9' },
  { id: '10', label: '10' },
  { id: '11', label: '11' },
  { id: '12', label: '12' },
  { id: '13', label: '13' },
  { id: '14', label: '14' },
  { id: '15', label: '15' },
  { id: '16', label: '16', className: 'grid-item-span-2' },
  { id: '17', label: '17' }
];

const StaticGrid = () => {
  const [gridItems, setGridItems] = useState(fallbackGridItems);

  useEffect(() => {
    const loadGridItems = async () => {
      try {
        const response = await fetch('/data/static-grid.json');
        if (!response.ok) {
          throw new Error(`Failed to load grid config: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          setGridItems(data.items);
        }
      } catch (error) {
        console.error('Using fallback grid data:', error);
      }
    };

    loadGridItems();
  }, []);

  return (
    <div className="static-grid-container">
      {/* Newspaper Header */}
      <div className="newspaper-header" hidden={true}>
        <div className="newspaper-title">THE DAILY HERALD</div>
        <div className="newspaper-date">Sunday, May 4, 2026</div>
        <div className="newspaper-headline">BREAKING: Revolutionary Grid Layout Technology Transforms Web Design</div>
        <div className="newspaper-subheadline">Local developers create stunning 4x5 responsive grid system</div>
      </div>

       <div className="headline-container" hidden={true}>
        <img src={headlineImage} alt="Newspaper Headline" className="headline-image" />
      </div>
      
      <div className="static-grid">
        {gridItems.map((item) => (
          <div
            key={item.id}
            className={`grid-item${item.className ? ` ${item.className}` : ''}`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaticGrid;
