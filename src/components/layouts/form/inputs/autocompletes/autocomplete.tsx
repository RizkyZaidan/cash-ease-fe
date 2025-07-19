"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { isEmpty, titleize } from "@/components/utility";
import { Icon } from "@iconify/react";
import { AutocompleteProps } from "@/structures/types";
import { Option } from "@/structures/interfaces";

const Autocomplete: React.FC<AutocompleteProps> = ({
  label = null,
  placeholder,
  value,
  options,
  isRequired = false,
  onChange,
  onInputChange,
  endAdornmentAction, // Custom endAdornment if provided
  endAdornment, // Custom endAdornment if provided
  isDropdown = false, // Default to false for autocomplete behavior
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const groupRefs = useRef<{ [key: string]: HTMLLIElement | null }>({});

  useEffect(() => {
    if (value) {
      // If value.name exists, use it
      if (value.label) {
        setInputValue(value.label);
      }
      // If value.name is null and isDropdown is true, try to find matching option by id
      else if (isDropdown && value.id) {
        const matchingOption = options.find(option => option.id === value.id);
        setInputValue(matchingOption?.label ?? "");
      }
      // If no name and not in dropdown mode or no matching id, reset input
      else {
        // setInputValue("");
      }
    } else {
      setInputValue(""); // Reset input if value is unset/null
    }
  }, [value, options, isDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine if dropdown should open above or below
  useEffect(() => {
    if (isOpen && inputRef.current && dropdownRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const maxOptionHeight = 240; // 15rem
      const dropdownHeight = Math.min(
        dropdownRef.current.offsetHeight || maxOptionHeight,
        maxOptionHeight
      );
      const spaceBelow = window.innerHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;
      const threshold = 10;

      setDropUp(
        spaceBelow < dropdownHeight + threshold &&
        spaceAbove > dropdownHeight + threshold
      );
    }
  }, [isOpen, inputValue, options]);

  // Filter options based on input (only if not in dropdown mode)
  const filteredOptions = isDropdown
    ? options // Show all options in dropdown mode
    : options.filter((option) =>
      (option?.label ?? "").toLowerCase().includes(inputValue.toLowerCase())
    );

  // Manage sticky headers with IntersectionObserver
  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;

    const dropdown = dropdownRef.current;
    const observerOptions = {
      root: dropdown,
      rootMargin: "0px 0px -90% 0px", // Trigger when header is near top (adjust based on header height)
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      let activeGroup: string | null = null;

      // Find the first group header that is intersecting (near the top)
      entries.forEach((entry) => {
        const group = entry.target.getAttribute("data-group");
        if (entry.isIntersecting && group) {
          if (!activeGroup) activeGroup = group; // Take the first intersecting header as active
        }
      });

      // Update z-index or visibility for all headers
      Object.entries(groupRefs.current).forEach(([group, ref]) => {
        if (ref) {
          if (group === activeGroup) {
            ref.style.zIndex = "10"; // Higher z-index for active header
            ref.style.position = "sticky";
            ref.style.top = "0";
          } else {
            ref.style.zIndex = "1"; // Lower z-index for inactive headers
            // Optionally, you can set position to static or adjust top to unstick
          }
        }
      });
    }, observerOptions);

    // Observe all group headers
    Object.values(groupRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  // Select an option
  const handleSelect = (option: Option) => {
    onChange(option);
    setInputValue(option?.label ?? "");
    setIsOpen(false);
  };

  // Handle input change with unset logic and pass typed value to parent (only if not in dropdown mode)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDropdown) return; // Prevent typing in dropdown mode

    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);

    // Pass the typed value to the parent via onInputChange if provided
    if (onInputChange) {
      onInputChange(newValue);
    }

    // If input becomes empty, unset the value by calling onChange with null values
    if (newValue === "") {
      onChange({ id: null, name: null, label: "null" });
    }
  };

  // Handle click to toggle dropdown in dropdown mode
  const handleClick = () => {
    if (isDropdown) {
      setIsOpen(!isOpen); // Toggle dropdown on click in dropdown mode
    } else {
      setIsOpen(true); // Open dropdown on click in autocomplete mode
    }
  };

  // Calculate dropdown position for portal
  const getOptionPosition = () => {
    if (!inputRef.current) return { top: 0, left: 0, width: 0 };

    const inputRect = inputRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const dropdownHeight = dropdownRef.current?.offsetHeight || 240; // Fallback to max height if not rendered yet

    return {
      top: dropUp
        ? inputRect.top + scrollTop - dropdownHeight - 4 // Adjust for mb-1 equivalent (4px)
        : inputRect.bottom + scrollTop + 4, // Adjust for mt-1 equivalent (4px)
      left: inputRect.left + scrollLeft,
      width: inputRect.width,
    };
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {!isEmpty(label) && (
        <label
          className={`block mb-1 mt-2 !leading-6 sm:text-sm lg:text-md text-black text-left${!isEmpty(label) ? " mb-1" : ""}`}
        >
          {label}
          {isRequired && (
            <span className="text-danger sm:text-xxs lg:text-xs ml-1 align-top">
              &#x2731;
            </span>
          )}
        </label>
      )}

      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={titleize(inputValue)}
          onChange={handleInputChange}
          onFocus={!isDropdown ? () => setIsOpen(true) : undefined} // Only set focus behavior if not in dropdown mode
          onClick={handleClick} // Handle click to toggle dropdown
          readOnly={isDropdown} // Make input read-only in dropdown mode
          className={`w-full sm:h-input-standard-sm md:h-input-standard ring-1 border-none outline-none ring-input-gray focus:outline-none focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary transition duration-500 ease-in-out text-black rounded px-3 py-2 sm:text-xxxs md:text-sm lg:text-md pr-10 ${isDropdown ? "cursor-pointer" : ""
            }`} // Added padding-right for endAdornment and cursor-pointer for dropdown mode
        />
        <div onClick={endAdornmentAction ? endAdornmentAction : handleClick} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center cursor-pointer">
          {endAdornment ? (
            endAdornment // Render custom endAdornment if provided
          ) : (
            <Icon
              icon="iconoir:chevron-down" // Default icon if no custom endAdornment is provided
              className="text-gray-medium w-5 h-5"
            />
          )}
        </div>
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <ul
            ref={dropdownRef}
            className="border border-neutral-400 bg-white rounded shadow max-h-60 overflow-auto text-left z-[1000] sm:text-xxxs md:text-sm lg:text-md"
            style={{
              position: "absolute",
              top: getOptionPosition().top,
              left: getOptionPosition().left,
              width: getOptionPosition().width,
            }}
          >
            {
              filteredOptions.length > 0 &&
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black text-left sm:text-xxxs md:text-sm lg:text-md"
                  onClick={() => handleSelect(option)}
                >
                  {option.label ?? ""}
                </li>
              ))
            }
            {
              filteredOptions.length === 0 && inputValue !== "" &&
              (
                <li
                  key={"no-data"}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black text-left sm:text-xxxs md:text-sm lg:text-md"
                  onClick={() => { }}
                >
                  {"Data tidak tersedia!"}
                </li>
              )
            }
            {
              filteredOptions.length === 0 && inputValue === "" &&
              (
                <li
                  key={"no-data"}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black text-left sm:text-xxxs md:text-xxs lg:text-xs"
                  onClick={() => { }}
                >
                  {"Cari Kata Kunci"}
                </li>
              )
            }
          </ul>,
          document.body
        )}
    </div>
  );
};

export default Autocomplete;
