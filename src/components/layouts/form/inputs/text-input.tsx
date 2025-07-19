"use client";

import React from "react";
import { Input, InputProps } from "@material-tailwind/react";
import { Icon } from "@iconify/react";

interface TextInputProps extends InputProps {
  startAdornmentIcon?: string; // Iconify icon name for the front adornment
  startAdornmentInteractive?: boolean; // Whether the front adornment is clickable
  onStartAdornmentClick?: () => void; // Callback when front adornment is clicked (if interactive)
  startAdornmentClassName?: string; // Custom class for styling the front adornment

  endAdornmentIcon?: string; // Iconify icon name for the end adornment 
  endAdornmentInteractive?: boolean; // Whether the end adornment is clickable
  onEndAdornmentClick?: () => void; // Callback when end adornment is clicked (if interactive)
  endAdornmentClassName?: string; // Custom class for styling the end adornment
}

const TextInput: React.FC<TextInputProps> = ({
  startAdornmentIcon,
  startAdornmentInteractive = false,
  onStartAdornmentClick,
  startAdornmentClassName = "",

  endAdornmentIcon,
  endAdornmentInteractive = false,
  onEndAdornmentClick,
  endAdornmentClassName = "",

  className = "",
  ...inputProps
}) => {
  // Calculate padding classes based on adornments presence
  // Default input padding-left and padding-right (adjust as needed)
  const paddingLeftClass = startAdornmentIcon ? "pl-10" : "";
  const paddingRightClass = endAdornmentIcon ? "pr-10" : "";

  return (
    <div className="relative w-full">
      {/* Front Adornment */}
      {startAdornmentIcon && (
        <span
          className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center ${
            startAdornmentInteractive
              ? "cursor-pointer hover:opacity-80"
              : "cursor-not-allowed opacity-50"
          } ${startAdornmentClassName}`}
          onClick={
            startAdornmentInteractive && onStartAdornmentClick
              ? onStartAdornmentClick
              : undefined
          }
          role={startAdornmentInteractive ? "button" : undefined}
          tabIndex={startAdornmentInteractive ? 0 : undefined}
          onKeyDown={
            startAdornmentInteractive && onStartAdornmentClick
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onStartAdornmentClick();
                  }
                }
              : undefined
          }
          aria-hidden={!startAdornmentInteractive}
        >
          <Icon icon={startAdornmentIcon} className="w-5 h-5 text-gray-500" />
        </span>
      )}

      {/* Input */}
      <Input
        className={`h-input-standard w-full ${paddingLeftClass} ${paddingRightClass} ${className}`}
        {...inputProps}
      />

      {/* End Adornment */}
      {endAdornmentIcon && (
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center ${
            endAdornmentInteractive
              ? "cursor-pointer hover:opacity-80"
              : "cursor-not-allowed opacity-50"
          } ${endAdornmentClassName}`}
          onClick={
            endAdornmentInteractive && onEndAdornmentClick
              ? onEndAdornmentClick
              : undefined
          }
          role={endAdornmentInteractive ? "button" : undefined}
          tabIndex={endAdornmentInteractive ? 0 : undefined}
          onKeyDown={
            endAdornmentInteractive && onEndAdornmentClick
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onEndAdornmentClick();
                  }
                }
              : undefined
          }
          aria-hidden={!endAdornmentInteractive}
        >
          <Icon icon={endAdornmentIcon} className="w-5 h-5 text-gray-500" />
        </span>
      )}
    </div>
  );
};

export default TextInput;
