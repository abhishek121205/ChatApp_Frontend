import { createContext, useContext, useState, useEffect } from 'react';
// import { loginUser, registerUser, getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser().then(userData => {
        setUser(userData);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      return await response.json(); // The server should return the user object
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        localStorage.removeItem('token'); // Remove invalid token
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (email, password) => {
    try {
      // const response = await loginUser(email, password);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // Set headers for JSON data
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      })
      const dataResponse = await response.json();
      localStorage.setItem('token', dataResponse.token);
      setUser(dataResponse.user);
      return dataResponse;
    } catch (error) {
      console.log(error.message || error);
      throw error
    }
  };

  const register = async (username, email, password) => {
    try {
      // const response = await registerUser(username, email, password);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // Set headers for JSON data
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        }),
      })
      const dataResponse = await response.json()
      // console.log(dataResponse);
      localStorage.setItem('token', dataResponse.token);
      setUser(dataResponse.user);
      return dataResponse;
    } catch (error) {
      console.log(error.message || error);
      throw error
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};