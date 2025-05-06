import { useEffect, useState } from 'react';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in user:", user.uid);
        setIsAuthenticated(true);
        navigate('/chat');
      } else {
        console.log("No user logged in");
        setIsAuthenticated(false);
        navigate('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>; // or a spinner
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/chat"
        element={isAuthenticated ? <Chat /> : <Login />}
      />
    </Routes>
  );
}

export default App;

