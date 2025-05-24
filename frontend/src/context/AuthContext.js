import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginAdmin } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Periksa jika sudah login
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (username, password) => {
    setError(null);
    setLoading(true);
    
    try {
      const data = await loginAdmin(username, password);
      
      // Simpan user di state dan localStorage
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    // Hapus user dari state dan localStorage
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 