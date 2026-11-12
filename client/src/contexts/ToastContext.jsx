import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
          let bg = 'bg-stone-900 text-amber-100 border-amber-900/40';
          if (toast.type === 'success') bg = 'bg-emerald-950 text-emerald-100 border-emerald-800';
          if (toast.type === 'error') bg = 'bg-rose-950 text-rose-100 border-rose-800';
          if (toast.type === 'warning') bg = 'bg-amber-950 text-amber-100 border-amber-800';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-lg shadow-xl border text-sm font-sans flex items-center justify-between gap-3 animate-fade-in ${bg}`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 text-xs font-mono"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: (msg) => alert(msg),
      removeToast: () => {},
    };
  }
  return context;
};
