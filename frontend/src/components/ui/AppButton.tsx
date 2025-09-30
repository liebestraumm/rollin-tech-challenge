import { twMerge } from "tailwind-merge";

interface AppButtonProps {
  children: React.ReactNode;
  twStyle?: string;
  onClick: () => void;
}

const AppButton = ({ children, onClick, twStyle }: AppButtonProps) => {
  const buttonClass = twMerge(
    "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600",
    twStyle
  );
  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

export default AppButton;
