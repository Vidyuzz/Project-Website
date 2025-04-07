import React from 'react'
import "./Navbar.css"
import image from './Logo.png'
import { Link } from 'react-router';

function Navbar() {
  return (
    <div className="App1">
    <div className='Logo'><img src={image} className='a' alt='Logo'/></div>
    <div className='Nav'>
      <li><Link to="/" className='h'>Home</Link></li> 
      <li> About US </li>
      <li><Link to="/Product" className='h'>Product</Link>  </li>
      <li> Contact US </li>
    </div>
    
  </div>
  );
}

export default Navbar