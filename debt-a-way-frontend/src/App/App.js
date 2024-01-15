import React from 'react';
import axios from 'axios'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import LoginRegister from '../LoginRegister/LoginRegister';
import Home from '../Home/Home';
import DebtsOwed from '../DebtsOwed/DebtsOwed';
import DebtsReceivable from '../DebtsReceivable/DebtsReceivable';
import Wallet from '../Wallet/Wallet';
import './App.css';
import Footer from '../Footer/Footer';

// Import additional components or hooks as needed

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('userToken');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

function App() {
  let isAuthenticated = false; // Replace this with actual authentication logic
  const userToken = localStorage.getItem('token');

  if(userToken){
    isAuthenticated = true;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/debts-owed" element={<DebtsOwed/>} />
        <Route path="/debts-receivable" element={<DebtsReceivable/>} />
        <Route path="/wallet" element={<Wallet/>} />
        {/* Define other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
