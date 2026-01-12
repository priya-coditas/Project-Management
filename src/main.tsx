import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './AppRouter'
import AuthContext from './store/AuthContext';

const AppWrapper = () => {
  // Initialize state from localStorage
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');
  const [user, setUser] = useState(() => localStorage.getItem('user') || '');
  const [userId, setUserId] = useState<string | number>(() => localStorage.getItem('userId') || '');

  // Sync state changes to localStorage
  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', String(userId));
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  return (
    <AuthContext.Provider value={{ role, setRole, user, setUser, userId, setUserId }}>
      <AppRouter />
    </AuthContext.Provider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <AppWrapper/>
      </BrowserRouter>
  </StrictMode>,
)
