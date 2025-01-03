// context/SnackbarContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar } from 'react-native-paper';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(3000);

  const showSnackbar = useCallback((message, duration = 3000) => {
    setMessage(message);
    setDuration(duration);
    setVisible(true);
  }, []);

  const hideSnackbar = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        duration={duration}
        onDismiss={hideSnackbar}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};