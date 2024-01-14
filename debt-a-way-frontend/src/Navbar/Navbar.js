import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate();

  const isLoggedIn = () => {
    return localStorage.getItem('userToken') != null;
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className='nav-logo'>
        <img className="navbar-img-logo" src="/logo.png" rel='icon' />
        <div className="navbar-logo-text"> Debt-A-Way</div>
      </div>
      {isLoggedIn() && (
      <div className="navbar-links">
          <Link className="nav-item" to="/home">Home</Link>
          <Link className="nav-item" to="/debts-owed">Owed</Link>
          <Link className="nav-item" to="/debts-receivable">Receivable</Link>
          <Link className="nav-item" to="/wallet">Wallet</Link>
        <div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        )}
    </nav>
  );
};

export default Navbar;



