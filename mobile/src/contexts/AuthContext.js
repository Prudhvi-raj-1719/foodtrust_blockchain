import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      console.log('LoadUser - Raw userData:', userData);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('LoadUser - Parsed user:', parsedUser);
        console.log('LoadUser - User role:', parsedUser.role);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // Mock login - replace with actual API call
      const mockUser = {
        id: '1',
        username: username,
        role: username, // Use username as role for demo
        organization: username === 'farmer' ? 'Green Valley Farms' :
                     username === 'processor' ? 'Fresh Foods Co.' :
                     username === 'distributor' ? 'Logistics Plus' :
                     username === 'retailer' ? 'Green Market' :
                     username === 'consumer' ? 'Consumer' :
                     username === 'regulator' ? 'Food Safety Authority' : 'Organization',
        name: username === 'farmer' ? 'Farmer User' : 
              username === 'processor' ? 'Processor User' :
              username === 'distributor' ? 'Distributor User' :
              username === 'retailer' ? 'Retailer User' :
              username === 'consumer' ? 'John Doe' :
              username === 'regulator' ? 'Regulator User' : 'User'
      };

      console.log('Login - Creating user:', mockUser);
      console.log('Login - User role:', mockUser.role);

      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
