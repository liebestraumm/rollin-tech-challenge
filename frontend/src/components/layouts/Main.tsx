import { type FC, type ReactNode } from "react";

interface MainProps {
  children?: ReactNode;
}

const Main: FC<MainProps> = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Main;
