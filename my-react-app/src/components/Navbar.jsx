import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white sticky top-0 z-50">
      {/* Logo (clickable link to home) */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-green-600">
        <img src={logo} alt="ThreadLink Logo" className="w-10 h-8 object-contain" />
        <span className="text-black">
          Thread<span className="text-orange-500">Link</span>
        </span>
      </Link>

      {/* Desktop Menu */}

      
      <nav className="hidden md:flex items-center gap-6">
        <ScrollLink
          to="home"
          smooth={true}
          duration={500}
          offset={-70}
          className="text-gray-700 hover:text-green-600 font-medium cursor-pointer"
        >
          Home
        </ScrollLink>

        <ScrollLink
          to="about"
          smooth={true}
          duration={500}
          offset={-70}
          className="text-gray-700 hover:text-green-600 font-medium cursor-pointer"
        >
          About Us
        </ScrollLink>

        <Link
          to="/register"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold text-sm"
        >
          Sign In
        </Link>
      </nav>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 right-6 bg-white border rounded-lg shadow-md w-40 py-2 flex flex-col items-start z-50 md:hidden">
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            offset={-70}
            className="px-4 py-2 text-gray-700 hover:text-green-600 w-full text-left"
            onClick={() => setIsOpen(false)}
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            offset={-70}
            className="px-4 py-2 text-gray-700 hover:text-green-600 w-full text-left"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </ScrollLink>
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md mx-4 mt-2 w-medium text-sm font-medium text-center"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
