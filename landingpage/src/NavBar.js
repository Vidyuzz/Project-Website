import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-logo">GVM</div>

        <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link to="./ParentComponent">Home</Link>  
          <Link to="./Image">Analyse</Link>  
          <Link to="./TextEditor">Convertor</Link>
          <a href="#contact">Contact</a>
        </nav>

        <div
          className={`hamburger ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
