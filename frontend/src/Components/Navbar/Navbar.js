// src/Navbars/ProblemsNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
//import { useAuth } from '../AuthContext';

const Navbar = () => {
  //const { logout } = useAuth();

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">
        <Link to="/">Your App Title</Link>
      </div>
      <div className="space-x-4">
        <button className="hover:text-gray-300">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

