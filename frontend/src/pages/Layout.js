// Layout.js
import '../App.css';
import logo from '../logo.svg';
import { Outlet, Link } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../AuthContext.js';

const Layout = () => {
  const { user, logout } = useAuth(); // Destructure the logout function from the auth context

  return (
    <div className="App">
      <header className="App-header">
        <img className="App-logo" src={logo} alt="logo" />
        {user && (
          <div className="user-info">
            <p>Logged in as <b>{user.user.username}</b></p>
            <button id="logout-btn" onClick={logout}>Logout</button>
          </div>
        )}
      </header>
      <Outlet />
    </div>
  );
};

export default Layout;