import { createContext, useContext, ReactNode } from 'react';
import toast, { Toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastStyles = {
  success: {
    style: {
      background: '#10B981',
      color: 'white',
    },
    icon: <CheckCircle className="w-5 h-5" />,
  },
  error: {
    style: {
      background: '#EF4444',
      color: 'white',
    },
    icon: <XCircle className="w-5 h-5" />,
  },
  info: {
    style: {
      background: '#3B82F6',
      color: 'white',
    },
    icon: <AlertCircle className="w-5 h-5" />,
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const showSuccess = (message: string) => {
    toast(message, {
      ...toastStyles.success,
      duration: 3000,
      position: 'top-right',
      style: {
        ...toastStyles.success.style,
        marginTop: '2rem',
      },
    });
  };

  const showError = (message: string) => {
    toast(message, {
      ...toastStyles.error,
      duration: 4000,
      position: 'bottom-center',
      style: {
        ...toastStyles.error.style,
        marginBottom: '4rem',
      },
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      ...toastStyles.info,
      duration: 3000,
      position: 'bottom-center',
      style: {
        ...toastStyles.info.style,
        marginBottom: '4rem',
      },
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
