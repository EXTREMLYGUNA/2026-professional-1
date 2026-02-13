/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authAPI } from './service/api.js';
import Login from './components/login.jsx';
import Register from './components/Register';
import Dashboard from './components/Dashboard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/index.css';

// Private Route Component
const PrivateRoute = ({ children }) => {
  return authAPI.isAuthenticated() ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

// Public Route Component (Redirect if logged in)
const PublicRoute = ({ children }) => {
  return !authAPI.isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <a className="navbar-brand" href="/">
              <i className="bi bi-shield-lock me-2"></i>
              Auth System
            </a>
            <div className="navbar-nav ms-auto">
              {authAPI.isAuthenticated() ? (
                <>
                  <a className="nav-link" href="/dashboard">
                    Dashboard
                  </a>
                  <button 
                    className="btn btn-outline-light btn-sm ms-2"
                    onClick={() => {
                      authAPI.logout();
                      window.location.href = '/login';
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a className="nav-link" href="/login">
                    Login
                  </a>
                  <a className="nav-link" href="/register">
                    Register
                  </a>
                </>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <div className="container text-center mt-5">
                <h1>Welcome to Authentication System</h1>
                <p className="lead">Please login or register to continue</p>
                <div className="mt-4">
                  <a href="/login" className="btn btn-primary me-3">Login</a>
                  <a href="/register" className="btn btn-success">Register</a>
                </div>
              </div>
            </PublicRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="*" element={
            <div className="container text-center mt-5">
              <h1>404 - Page Not Found</h1>
              <a href="/" className="btn btn-primary mt-3">Go Home</a>
            </div>
          } />
        </Routes>

        <footer className="bg-dark text-white text-center py-3 mt-5">
          <div className="container">
            <p className="mb-0">© 2026 Authentication System. All rights reserved.</p>
            <small>Built with MERN Stack</small>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;