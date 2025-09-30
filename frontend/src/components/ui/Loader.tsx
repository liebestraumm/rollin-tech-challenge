import Lottie from "lottie-react";

import scanningFileAnimation from "../../assets/animations/loading_hand.json";

interface LoaderProps {
  message?: string
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <p className="text-white text-2xl font-bold">
        {message}
      </p>
      <Lottie
        animationData={scanningFileAnimation}
        loop={true}
        width={200}
        height={200}
      />
    </div>
  );
};

export default Loader;
