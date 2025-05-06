import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import Chat from './components/Chat';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

const PrivateRoute = ({ isAuthenticated, children }) => {
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
      // If user is not authenticated and tries to access protected route
      if (!user && window.location.pathname === '/chat') {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/chat" /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/chat" /> : <Signup />}
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/chat' : '/login'} />}
      />
    </Routes>
  );
}

export default App;