import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import api from './services/api.js';

import Setup from './pages/Setup.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import HomePage from './pages/Home.jsx';
import FridgePage from './pages/Fridge.jsx';
import NewItem from './pages/NewItem.jsx';
import ShoppingList from './pages/ShoppingList.jsx';
import RecipesPage from './pages/Recipes.jsx';
import SettingsPage from './pages/Settings.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-fridgit-textMuted">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const [configured, setConfigured] = useState(null);

  useEffect(() => {
    api.get('/setup/status')
      .then(res => setConfigured(res.data.configured))
      .catch(() => setConfigured(false));
  }, []);

  if (configured === null) {
    return <div className="flex items-center justify-center h-screen text-fridgit-textMuted">Loading...</div>;
  }

  if (!configured) {
    return (
      <Routes>
        <Route path="*" element={<Setup onComplete={() => setConfigured(true)} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/fridge" element={<ProtectedRoute><FridgePage /></ProtectedRoute>} />
      <Route path="/new-item" element={<ProtectedRoute><NewItem /></ProtectedRoute>} />
      <Route path="/shopping" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
      <Route path="/recipes" element={<ProtectedRoute><RecipesPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: '12px', background: '#1A2A1E', color: '#fff', fontSize: '14px' } }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}