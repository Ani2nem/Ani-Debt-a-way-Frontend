import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css'
import Navbar from '../Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const showToast = (message) => {
  toast.info(message, {
    position: "top-center",
    autoClose: 3000, // milliseconds
  });
};

function LoginRegister() {
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [registerCredentials, setRegisterCredentials] = useState({ username: '', email: '', password: ''});
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginCredentials({ ...loginCredentials, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterCredentials({ ...registerCredentials, [e.target.name]: e.target.value });
    setLoginCredentials({ ...loginCredentials, [e.target.name]: e.target.value })
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://debt-a-way.onrender.com/api/users/login', loginCredentials);
  
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        navigate('/home');
      } else {
        // This block will execute if the backend doesn't return a token
        showToast("Sorry, Our Website is Down at this moment, thank you for your patience.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast("Incorrect email or password. Please try again or register new account.");
      } else {
        console.error(error);
      }
    }
  };
  

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerCredentials.password !== registerCredentials.confirmPassword) {
        showToast('Passwords do not match');
        return;
    }
    
    try {
        const regResponse = await axios.post('https://debt-a-way.onrender.com/api/users/register', registerCredentials);
        if(regResponse.data.user){
          const loginResponse = await axios.post('https://debt-a-way.onrender.com/api/users/login', {
        email: registerCredentials.email,
        password: registerCredentials.password
      });
      if (loginResponse.data.token) {
        localStorage.setItem('userToken', loginResponse.data.token);
        navigate('/home');
      }
    }
  } catch (error) {
    console.error(error);
    if (error.response) {
      // duplicate username or email alert
        showToast("Username or email is already taken. Please choose a different one.");
    } else {
      // Handle other unexpected errors
      showToast("An unexpected error occurred. Please try again later.");
    }
  }
};

  return (
    <div className="Login-section">
      <Navbar />
    <div className="auth-container">
      <div className="login-section">
      <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Username or Email" 
            value={loginCredentials.email} 
            onChange={handleLoginChange} 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={loginCredentials.password} 
            onChange={handleLoginChange} 
          />
          <button className="ln-button" type="submit">Login</button>
        </form>
      </div>
      <div className="register-section">
      <h2>Register</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={registerCredentials.username} 
            onChange={handleRegisterChange} 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={registerCredentials.email} 
            onChange={handleRegisterChange} 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={registerCredentials.password} 
            onChange={handleRegisterChange} 
          />
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            value={registerCredentials.confirmPassword} 
            onChange={handleRegisterChange} 
          />
          <button className="ln-button"type="submit">Register</button>
        </form>
      </div>
    </div>
    <ToastContainer />
    </div>
  );
}

export default LoginRegister;

