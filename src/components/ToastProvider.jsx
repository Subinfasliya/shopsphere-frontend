import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

const Toast = ({ toast, onDismiss }) => (
  <div className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${toast.type === 'error' ? 'border-red-100' : 'border-emerald-100'}`} role="status">
    {toast.type === 'error' ? <XCircle className="mt-0.5 shrink-0 text-red-500" size={20} /> : <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} />}
    <p className="flex-1 text-sm font-medium text-slate-700">{toast.message}</p>
    <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification" className="text-slate-400 transition hover:text-slate-700">
      <X size={17} />
    </button>
  </div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    if (!message) return;
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current.slice(-3), { id, message, type }]);
    window.setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  useEffect(() => {
    const handleToast = (event) => showToast(event.detail.message, event.detail.type);
    window.addEventListener('shopsphere:toast', handleToast);
    return () => window.removeEventListener('shopsphere:toast', handleToast);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-20 z-50 flex flex-col items-end gap-3 sm:left-auto sm:w-auto" aria-live="polite">
        {toasts.map((toast) => <Toast key={toast.id} toast={toast} onDismiss={dismiss} />)}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};