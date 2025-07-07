// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('jwtToken');
    return token && token.length > 0;
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('emailLoggedIn');
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('jwtToken');
      const email = localStorage.getItem('emailLoggedIn');
      
      setIsAuthenticated(!!token && token.length > 0);
      setUserEmail(email);
    };

    // Verifica al montar
    checkAuth();

    // Escucha eventos de almacenamiento
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, []);

  const login = (token, email) => {
    localStorage.setItem('jwtToken', token);
    if (email) {
      localStorage.setItem('emailLoggedIn', email);
    }
    
    // Dispara eventos para notificar cambios
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('localStorageChange'));
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('emailLoggedIn');
    
    // Dispara eventos para notificar cambios
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('localStorageChange'));
  };

  return {
    isAuthenticated,
    userEmail,
    login,
    logout
  };
};

export default useAuth;
