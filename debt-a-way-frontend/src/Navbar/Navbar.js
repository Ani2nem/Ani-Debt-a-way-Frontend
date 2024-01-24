import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
  useNavigate();

  const isLoggedIn = () => {
    return localStorage.getItem('userToken') != null;
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
  };

  return (
    <nav className="navbar">
      <Link className='nav-logo' to="/home" id="home">
        <img className="navbar-img-logo" src="/logo.png" rel='icon' />
        <div className="navbar-logo-text"> Debt-A-Way</div>
      </Link>
      {isLoggedIn() && (
      <div className="navbar-links">
          <Link className="nav-item" to="/home">Home</Link>
          <Link className="nav-item" to="/debts-owed">Owed</Link>
          <Link className="nav-item" to="/debts-receivable">Receivable</Link>
          <Link className="nav-item" to="/wallet">Wallet</Link>
          <Link className="nav-item" to="/login" onClick={handleLogout}>Logout</Link>
        </div>
        )}
    </nav>
  );
};

export default Navbar;



