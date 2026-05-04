import * as React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  icon,
  endAdornment,
  error,
  className = '',
  ...props
}) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const inputName = name ?? inputId;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label
        htmlFor={inputId}
        className="text-sm font-medium text-[#1F2421]"
      >
        {label}
      </Label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-blue">
            {icon}
          </span>
        )}

        <Input
          id={inputId}
          name={inputName}
          {...props}
          className={`
            w-full py-3 bg-[#DCE1DE] text-[#1F2421] rounded-xl outline-none
            focus:ring-2 focus:ring-accent-orange transition-all
            ${icon ? 'pl-12' : 'pl-4'}
            ${endAdornment ? 'pr-12' : 'pr-4'}
          `}
        />

        {endAdornment && (
          <div className="absolute right-4 top-1/2 text-accent-black -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
