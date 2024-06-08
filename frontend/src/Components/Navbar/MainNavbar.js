import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import logo from '../../Assets/logo.png'

const MainNavbar = () => {
  const location = useLocation();

  const linkClasses = (path) => classNames('relative py-2 text-xl', {
    'text-green-500 after:content-[""] after:block after:h-1 after:bg-green-500 after:absolute after:bottom-0 after:left-0 after:right-0': location.pathname === path,
    'hover:text-gray-300': location.pathname !== path,
  });

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <NavLink to="/"><img src={logo} alt="App logo" /></NavLink>
      </div>
      <div className="flex space-x-10">
        <NavLink to="/" className={linkClasses('/')}>
          Home
        </NavLink>
        <NavLink to="/login" className={linkClasses('/login')}>
          Login
        </NavLink>
        <NavLink to="/signup" className={linkClasses('/signup')}>
          Signup
        </NavLink>
      </div>
    </nav>
  );
};

export default MainNavbar;