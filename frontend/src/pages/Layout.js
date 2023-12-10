
import '../App.css';
import logo from '../logo.svg';

import { Outlet, Link } from "react-router-dom";

import React from 'react';
import { useAuth } from '../AuthContext'; // Import useAuth from your AuthContext


const Layout = () => {

  const { user } = useAuth(); // Destructure the user data from the auth context
  return (
    <>
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                {user && (
                  <div>
                    <p>Logged in as {user.user.username}!</p> {/* Display the user's username */}
                  </div>
                )}
            </header>
            <Outlet />
        </div>
    </>
  )
};

export default Layout;