// React Imports
import { FunctionComponent } from "react";

interface IButtonLoaderProps {
  children: React.ReactNode;
}
/**
 * @description Button Loader Component- This component is responsible for the button loader.
 * This component is used to show the button loader.
 *
 * @returns ButtonLoader
 *
 * @example
 * <ButtonLoader />
 */
const ButtonLoader: FunctionComponent<IButtonLoaderProps> = ({ children }) => {
  return (
    <div className="w-10 h-10 border-4 border-t-4 border-gray-900 rounded-full animate-spin">
      {children}
    </div>
  );
};

export default ButtonLoader;
