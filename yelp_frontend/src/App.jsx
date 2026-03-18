import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import authService from './services/auth';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProfilePage from './components/Profile/ProfilePage';
import PreferencesEditor from './components/Profile/PreferencesEditor';
import RestaurantSearch from './components/Restaurant/RestaurantSearch';
import RestaurantDetails from './components/Restaurant/RestaurantDetails';
import AIChatbot from './components/ChatBot/AIChatbot';
import './App.css';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check if already logged in
    if (authService.isAuthenticated()) {
      setIsLoggedIn(true);
      setUserRole(authService.getUserRole());
      // In a real app, fetch user name from API
      setUserName('User');
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app">
        {/* Navigation */}
        <Navbar expand="lg" sticky="top" className="navbar-custom">
          <Container>
            <Navbar.Brand href="/" className="brand-logo">
              🍽️ Yelp Prototype - Lab Pair 45
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {!isLoggedIn ? (
                  <>
                    <Nav.Link href="/login">Sign In</Nav.Link>
                    <Nav.Link href="/signup">Sign Up</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/">Explore</Nav.Link>
                    <Nav.Link href="/chatbot">AI Assistant</Nav.Link>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                    <Nav.Link href="/preferences">Preferences</Nav.Link>
                    <Nav.Link onClick={handleLogout} className="cursor-pointer">
                      Logout
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<RestaurantSearch />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />

          {/* Protected Routes */}
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <AIChatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preferences"
            element={
              <ProtectedRoute>
                <PreferencesEditor />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Footer */}
        <footer className="footer mt-5">
          <Container>
            <div className="footer-content">
              <p>&copy; 2024 Yelp Prototype. All rights reserved.</p>
              <nav className="footer-nav">
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <a href="#privacy">Privacy</a>
              </nav>
            </div>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
