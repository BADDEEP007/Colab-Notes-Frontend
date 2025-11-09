import { useState, useCallback, createContext, useContext } from 'react';
import Toast from './Toast';

/**
 * Toast context for managing toast notifications globally
 */
const ToastContext = createContext(null);

/**
 * Hook to access toast functions
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

/**
 * Toast provider component
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      return addToast(message, type, duration);
    },
    [addToast]
  );

  const showSuccess = useCallback(
    (message, duration = 4000) => {
      return addToast(message, 'success', duration);
    },
    [addToast]
  );

  const showError = useCallback(
    (message, duration = 4000) => {
      return addToast(message, 'error', duration);
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, duration = 4000) => {
      return addToast(message, 'warning', duration);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, duration = 4000) => {
      return addToast(message, 'info', duration);
    },
    [addToast]
  );

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast, index) => (
          <div key={toast.id} className="pointer-events-auto" style={{ marginTop: index * 8 }}>
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
