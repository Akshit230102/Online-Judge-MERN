// src/Navbars/MainNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const MainNavbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">
        <Link to="/">Your App Title</Link>
      </div>
      <div className="space-x-4">
      <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/login" className="hover:text-gray-300">Login</Link>
        <Link to="/signup" className="hover:text-gray-300">Signup</Link>
      </div>
    </nav>
  );
};

export default MainNavbar;
