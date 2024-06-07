// src/Sidebar.js
import React from 'react';

const categories = [
  'All',
  'Basic',
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stacks and Queues',
  'Dynamic Programming',
  'Trees',
  'Graphs'
  // Add more categories as needed
];

const Sidebar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-gray-800 bg-opacity-90 text-white shadow-lg p-6 w-64 h-full fixed">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category} className="mb-2">
            <button
              className={`w-full text-left p-2 rounded ${selectedCategory === category ? 'bg-gray-700 font-bold' : 'bg-transparent hover:bg-gray-600'}`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
