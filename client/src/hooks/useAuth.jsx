import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fridgit_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fridgit_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('fridgit_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const saveAuth = (data) => {
    localStorage.setItem('fridgit_token', data.token);
    localStorage.setItem('fridgit_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    saveAuth(res.data);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    saveAuth(res.data);
    return res.data;
  };

  // Insecure mode: login by picking a user id
  const guestLogin = async (userId) => {
    const res = await api.post('/auth/login', { userId });
    saveAuth(res.data);
    return res.data;
  };

  // Insecure mode: register with just a name
  const guestRegister = async (name) => {
    const res = await api.post('/auth/register', { name });
    saveAuth(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('fridgit_token');
    localStorage.removeItem('fridgit_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, guestLogin, guestRegister, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
