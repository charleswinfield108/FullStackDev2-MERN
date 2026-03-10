import { Toast, ToastContainer as BSToastContainer } from 'react-bootstrap';
import { useToast } from '../hooks/useToast';
import './ToastContainer.css';

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'danger':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ℹ';
    default:
      return '•';
  }
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <BSToastContainer position="top-end" className="toast-container-wrapper">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          bg={toast.type}
          onClose={() => removeToast(toast.id)}
          show={true}
          delay={3000}
          autohide
          className="app-toast"
        >
          <Toast.Body className="d-flex align-items-center justify-content-between text-white">
            <div className="d-flex align-items-center gap-2">
              <span className={`toast-icon toast-icon-${toast.type}`}>
                {getIcon(toast.type)}
              </span>
              <span>
                {toast.message}
              </span>
            </div>
            <button
              className="toast-close-btn"
              onClick={() => removeToast(toast.id)}
              aria-label="Close toast"
            >
              ✕
            </button>
          </Toast.Body>
        </Toast>
      ))}
    </BSToastContainer>
  );
};
