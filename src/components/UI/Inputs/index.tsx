// React Imports
import { FunctionComponent, ReactNode } from "react";

// Util Imports
import { cn } from "../../../utils/tailwind-cn";

interface ICustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  Icon?: ReactNode;
}

/**
 * @description Custom Input Component - This component is responsible for the layout of the custom input.
 *
 * @param label - The label for the input
 * @param type - The type of the input
 * @param placeholder - The placeholder for the input
 * @param value - The value of the input
 * @param onChange - The onChange function for the input
 * @param className - The className for the input
 * @param onKeyDown - The onKeyDown function for the input
 * @param Icon - The Icon for the input
 * @param rest - The rest of the props for the HTML input - This is used to pass the rest of the props to the input.
 *
 * @returns CustomInput - The custom input component
 *
 * @example
 * <CustomInput
 *  label="Email"
 *  type="email"
 *  placeholder="Enter your email"
 *  value={email}
 *  onChange={handleEmailChange}
 *  className="w-full"
 *  onKeyDown={handleEmailKeyDown}
 *  Icon={<MdClear />}
 *  rest={{
 *    autoFocus: true,
 *   // Other props for the input
 *  }}
 * />
 */
const CustomInput: FunctionComponent<ICustomInputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  className,
  onKeyDown,
  Icon,
  ...rest
}): ReactNode => {
  return (
    <div className={cn("flex flex-col items-start justify-center w-full")}>
      <label
        htmlFor={label}
        className={cn("text-sm font-medium text-gray-900")}
      >
        {label}
      </label>
      <div
        className={cn("relative mt-1 rounded-md shadow-sm", Icon && "pr-10")}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            "mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300",
            value && "text-gray-900",
            className
          )}
          onKeyDown={onKeyDown}
          {...rest}
        />
        {Icon && (
          <div
            className={cn("absolute inset-y-0 right-0 pr-3 flex items-center")}
          >
            {Icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
