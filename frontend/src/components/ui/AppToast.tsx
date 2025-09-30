import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const AppToast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => {
          onClose();
        }, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = 'flex items-center gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out max-w-md w-full';
    
    if (type === 'success') {
      return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
    }
    
    return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
  };

  const getIcon = () => {
    if (type === 'success') {
      return <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />;
    }
    
    return <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />;
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`${getToastStyles()} ${
          show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        {getIcon()}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AppToast;
