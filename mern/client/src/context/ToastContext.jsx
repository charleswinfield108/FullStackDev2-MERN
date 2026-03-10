import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const MAX_VISIBLE_TOASTS = 1; // Only show 1 toast at a time

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => {
      // If we're at max capacity, remove the oldest one and add the new one
      if (prev.length >= MAX_VISIBLE_TOASTS) {
        return [...prev.slice(1), toast];
      }
      return [...prev, toast];
    });

    // Auto-dismiss after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);
      
      // Store timer ID so we can clear it if manually dismissed
      return { id, timer };
    }

    return { id };
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
