import { twMerge } from "tailwind-merge";
import { XIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  twStyle?: string;
  onClose?: () => void;
  closeButton?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  closeButton,
  children,
  onClose,
  twStyle,
}) => {
  const modalClass = twMerge(
    "fixed inset-0 z-50 flex items-center justify-center bg-black/70",
    twStyle
  );

  if (!isOpen) return null;

  return (
    <div className={modalClass}>
      <div className="bg-transparent flex flex-col items-center justify-center">
        {closeButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 shadow"
            aria-label="Close modal"
            type="button"
          >
            <XIcon className="w-6 h-6" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
