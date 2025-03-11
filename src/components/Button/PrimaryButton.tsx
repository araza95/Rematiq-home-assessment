import React, { Fragment } from "react";

interface IPrimaryButtonProps {
  text: string;
  onClick: () => void;
  type: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * @description Primary Button Component- This component is responsible for the primary button.
 * This component is used to render the primary button.
 *
 * @returns PrimaryButton
 *
 * @example
 * <PrimaryButton text="Primary Button" onClick={() => console.log("Primary Button Clicked")} />
 */
const PrimaryButton: React.FunctionComponent<IPrimaryButtonProps> = ({
  onClick,
  text,
  children,
  className,
  disabled,
  type,
}) => {
  return (
    <Fragment>
      <button
        onClick={onClick}
        className={` font-bold py-2 px-4 rounded ${className} cursor-pointer`}
        disabled={disabled}
        type={type}
      >
        {text || children}
      </button>
    </Fragment>
  );
};

export default PrimaryButton;
