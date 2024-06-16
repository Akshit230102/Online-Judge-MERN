import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../Assets/logo.png';
import { removeToken } from '../../Utils/helpers'; // Import function to remove token

const Navbar = ({ fixed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from cookies
    removeToken();
    
    // Redirect to homepage
    navigate('/');
  };

  return (
    <nav className={`bg-black text-white p-4 flex justify-between items-center ${fixed ? 'fixed top-0 w-full z-50' : 'relative'}`}>
      <div className="text-lg font-bold">
        <img src={logo} alt="App logo" className="h-8" /> {/* Adjust the height of the logo as needed */}
      </div>
      <div className="space-x-4">
        <button className="bg-white text-black py-1 px-3 rounded-full hover:bg-gray-200" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
