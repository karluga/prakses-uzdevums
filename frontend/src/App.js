import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './AuthContext';

import Layout from "./pages/Layout";
import NoPage from './pages/NoPage';
import Login from './pages/Login';
import RouteReport from './pages/RouteReport';
import RouteExport from './pages/RouteExport';

// Create a ProtectedRoute component that redirects to /login if the user is not authenticated
const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  if (!auth.user) {
    // User is not authenticated, redirect to /login
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <ProtectedRoute>
                <RouteReport />
              </ProtectedRoute>
            } />
            <Route path="export" element={
              <ProtectedRoute>
                <RouteExport />
              </ProtectedRoute>
            } />
          <Route path="/login" element={<Login />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;