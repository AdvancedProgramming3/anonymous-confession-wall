import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user on load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const generateId = () => `Anonymous #${Math.floor(Math.random() * 9000) + 1000}`;

  const login = (username, password) => {
    // Simulate login API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For this mock, we just check if a user exists in localStorage "db"
        const users = JSON.parse(localStorage.getItem('users_db') || '[]');
        const foundUser = users.find(u => u.username === username && u.password === password);

        if (foundUser) {
          // Ensure legacy users get an ID if missing
          const anonymousId = foundUser.anonymousId || generateId();
          const userSession = { username: foundUser.username, anonymousId };

          setUser(userSession);
          localStorage.setItem('user', JSON.stringify(userSession));
          resolve(userSession);
        } else {
          reject(new Error('Invalid credentials (try registering first!)'));
        }
      }, 500);
    });
  };

  const register = (username, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users_db') || '[]');
        if (users.find(u => u.username === username)) {
          reject(new Error('Username already taken'));
          return;
        }

        const newUser = {
          username,
          email,
          password,
          anonymousId: generateId() // Assign persistent ID
        };

        users.push(newUser);
        localStorage.setItem('users_db', JSON.stringify(users));

        // Auto login after register
        const userSession = { username: newUser.username, anonymousId: newUser.anonymousId };
        setUser(userSession);
        localStorage.setItem('user', JSON.stringify(userSession));
        resolve(userSession);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
