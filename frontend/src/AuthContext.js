// AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);

  useEffect(() => {
    sessionStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const setAuthUser = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    // Perform any logout-related tasks (clear session, etc.)
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);