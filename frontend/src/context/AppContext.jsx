import React, { createContext, useReducer, useContext, useState, useEffect } from 'react';

// Initial state for the reducer
const initialState = {
  user: null, // e.g., { name: 'John', email: 'john@example.com' }
  items: [],  // Array of lost/found items
  loading: false,
  error: null,
};

// Actions for the reducer
const actionTypes = {
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    case actionTypes.LOGOUT:
      return { ...state, user: null };
    case actionTypes.SET_ITEMS:
      return { ...state, items: action.payload };
    case actionTypes.ADD_ITEM:
      return { ...state, items: [action.payload, ...state.items] };
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpWidgetOpen, setIsHelpWidgetOpen] = useState(false);

  // Auto-login (Persistent State)
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
            headers: { 'x-auth-token': token }
          });
          if (res.ok) {
            const user = await res.json();
            dispatch({ type: actionTypes.SET_USER, payload: user });
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Auth verification failed', err);
        }
      }
    };
    checkLoggedIn();
  }, []);

  // Handle Dark Mode toggle
  useEffect(() => {
    if (state.user?.preferences?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.user?.preferences?.darkMode]);

  // Helper actions
  const login = (userData) => {
    dispatch({ type: actionTypes.SET_USER, payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: actionTypes.LOGOUT });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AppContext.Provider value={{ state, dispatch,      // Global UI State
      isSidebarOpen,
      setIsSidebarOpen,
      isHelpWidgetOpen,
      setIsHelpWidgetOpen,
      login, 
      logout, 
      toggleSidebar 
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
