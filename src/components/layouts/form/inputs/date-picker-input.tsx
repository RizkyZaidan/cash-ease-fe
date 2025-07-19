"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { DayPicker } from "react-day-picker";
import { format, parseISO, isValid, parse, setYear, addMonths, subMonths } from "date-fns";
import "react-day-picker/dist/style.css"; // Import default styles for react-day-picker

interface DatePickerInputProps {
  value?: Date | string | null; // Date value (can be Date object or ISO string)
  onChange?: (date: Date | null) => void; // Callback for date changes
  endAdornmentIcon?: string; // Iconify icon name for the end adornment
  endAdornmentInteractive?: boolean; // Whether the end adornment is clickable
  onEndAdornmentClick?: () => void; // Custom callback when end adornment is clicked (if interactive)
  endAdornmentClassName?: string; // Custom class for styling the end adornment
  dateFormat?: string; // Format for displaying the date (default: "yyyy-MM-dd")
  disabledDays?: { before?: Date; after?: Date }; // Range of disabled days
  className?: string; // Custom class for the input
  placeholder?: string; // Placeholder text for the input
  disabled?: boolean; // Disable the input
  required?: boolean; // Make the input required
  name?: string; // Name attribute for the input
  id?: string; // ID attribute for the input
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  endAdornmentIcon = "mdi:calendar",
  endAdornmentInteractive = true,
  onEndAdornmentClick,
  endAdornmentClassName = "",
  className = "",
  dateFormat = "yyyy-MM-dd",
  disabledDays,
  placeholder = "",
  disabled = false,
  required = false,
  name,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (!value) return null;
    if (typeof value === 'string') {
      // Parse the date string with the format dd-MM-yyyy
      const parsed = parse(value, 'dd-MM-yyyy', new Date());
      return isValid(parsed) ? parsed : null;
    }
    return isValid(value) ? value : null;
  });
  const [viewMode, setViewMode] = useState<"day" | "year">("day"); // Toggle between day and year view
  const [currentYear, setCurrentYear] = useState<number>(
    selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()
  );
  const [displayedMonth, setDisplayedMonth] = useState<Date>(
    selectedDate && isValid(selectedDate) ? selectedDate : new Date()
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const yearContainerRef = useRef<HTMLDivElement>(null); // Ref for year picker container

  // Synchronize internal state with incoming value prop
  useEffect(() => {
    if (value === null || value === undefined) {
      setSelectedDate(null); // Clear internal state when value is null
      setDisplayedMonth(new Date()); // Reset displayed month to current date
    } else if (typeof value === 'string') {
      const parsed = parse(value, 'dd-MM-yyyy', new Date());
      setSelectedDate(isValid(parsed) ? parsed : null);
      if (isValid(parsed)) {
        setCurrentYear(parsed.getFullYear()); // Update currentYear when value changes
        setDisplayedMonth(parsed); // Update displayed month to match the value
      }
    } else if (isValid(value)) {
      setSelectedDate(value);
      setCurrentYear(value.getFullYear()); // Update currentYear when value changes
      setDisplayedMonth(value); // Update displayed month to match the value
    } else {
      setSelectedDate(null);
      setDisplayedMonth(new Date()); // Reset displayed month to current date
    }
  }, [value]); // Update whenever the value prop changes

  // Update selectedDate when currentYear changes
  useEffect(() => {
    if (currentYear !== (selectedDate ? selectedDate.getFullYear() : null)) {
      // If there is a selected date, update its year to currentYear
      if (selectedDate && isValid(selectedDate)) {
        const newDate = setYear(selectedDate, currentYear);
        setSelectedDate(newDate);
        setDisplayedMonth(newDate); // Update displayed month to match the new date
        if (onChange) {
          onChange(newDate);
        }
      } else {
        // If no date is selected, default to January 1st of the currentYear
        const newDate = new Date(currentYear, 0, 1);
        setSelectedDate(newDate);
        setDisplayedMonth(newDate); // Update displayed month to match the new date
        if (onChange) {
          onChange(newDate);
        }
      }
    }
  }, [currentYear, selectedDate, onChange]); // Trigger when currentYear changes

  // Handle click outside to close the date picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll to selected year when switching to year view
  useEffect(() => {
    if (viewMode === "year" && yearContainerRef.current) {
      const selectedYearElement = yearContainerRef.current.querySelector(`button[data-year="${currentYear}"]`);
      if (selectedYearElement) {
        selectedYearElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [viewMode, currentYear]);

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    const newDate = date || null;
    setSelectedDate(newDate);
    setIsOpen(false);
    if (newDate) {
      setCurrentYear(newDate.getFullYear()); // Update currentYear on date selection
      setDisplayedMonth(newDate); // Update displayed month to match the selected date
    }
    if (onChange) {
      onChange(newDate);
    }
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    const newDate = selectedDate ? setYear(selectedDate, year) : new Date(year, 0, 1);
    setSelectedDate(newDate);
    setCurrentYear(year);
    setDisplayedMonth(newDate); // Update displayed month to match the new date
    setViewMode("day"); // Switch back to day view after selecting year
    if (onChange) {
      onChange(newDate);
    }
  };

  // Handle month navigation (previous)
  const handlePrevMonth = () => {
    const newMonth = subMonths(displayedMonth, 1);
    setDisplayedMonth(newMonth);
    // Optionally update selectedDate if you want navigation to select a date
    if (selectedDate) {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
      setCurrentYear(newDate.getFullYear());
      if (onChange) {
        onChange(newDate);
      }
    }
  };

  // Handle month navigation (next)
  const handleNextMonth = () => {
    const newMonth = addMonths(displayedMonth, 1);
    setDisplayedMonth(newMonth);
    // Optionally update selectedDate if you want navigation to select a date
    if (selectedDate) {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
      setCurrentYear(newDate.getFullYear());
      if (onChange) {
        onChange(newDate);
      }
    }
  };

  // Handle input click to open date picker
  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  // Handle adornment click (custom action or toggle date picker)
  const handleAdornmentClick = () => {
    if (onEndAdornmentClick) {
      onEndAdornmentClick();
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Format the date for display in the input, only if it's a valid Date
  const displayValue = selectedDate && isValid(selectedDate) ? format(selectedDate, dateFormat) : "";

  // Transform disabledDays to a format compatible with react-day-picker
  const disabledMatcher = disabledDays
    ? [
      ...(disabledDays.before ? [{ before: disabledDays.before }] : []),
      ...(disabledDays.after ? [{ after: disabledDays.after }] : []),
    ]
    : undefined;

  // Year selection view
  const YearPicker = () => {
    const startYear = 1900;
    const endYear = new Date().getFullYear(); // Up to current year
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).reverse();

    return (
      <div ref={yearContainerRef} className="grid grid-cols-4 gap-2 p-2 max-h-64 overflow-y-auto">
        <h3 className="col-span-4 text-center text-sm font-medium text-gray-700 mb-2">Select Year</h3>
        {years.map((year) => (
          <button
            key={year}
            data-year={year} // Add data attribute for scrolling reference
            onClick={() => handleYearSelect(year)}
            className={`p-2 text-sm rounded-md hover:bg-gray-100 ${currentYear === year ? "bg-primary text-white" : "text-gray-700"}`}
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  // Toggle year view
  const toggleYearView = () => {
    setViewMode(viewMode === "day" ? "year" : "day");
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        className={`w-full sm:h-input-standard-sm md:h-input-standard pr-10 cursor-pointer border border-input-gray rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary hover:ring-1 hover:ring-primary transition duration-500 ease-in-out text-sm ${className} ${disabled ? "bg-gray-100 cursor-not-allowed opacity-70 text-transparent" : ""}`}
        value={displayValue}
        onChange={() => { }} // Prevent direct typing; date picker handles input
        onClick={handleInputClick}
        readOnly // Make input read-only to prevent manual edits
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        name={name}
        id={id}
      />

      {endAdornmentIcon && (
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center ${endAdornmentInteractive && !disabled ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed opacity-50"} ${endAdornmentClassName}`}
          onClick={endAdornmentInteractive && !disabled ? handleAdornmentClick : undefined}
        >
          <Icon icon={endAdornmentIcon} className="w-5 h-5 text-gray-500" />
        </span>
      )}
      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute z-50 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 p-2 w-fit"
        >
          {viewMode === "day" && (
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={handlePrevMonth}
                className="text-sm font-medium text-gray-700 hover:text-primary"
                disabled={disabledDays?.before && displayedMonth <= disabledDays.before}
              >
                <Icon icon="mdi:chevron-left" className="w-5 h-5" />
              </button>
              <button
                onClick={toggleYearView}
                className="text-lg font-medium text-gray-700 hover:text-primary"
              >
                {selectedDate ? format(selectedDate, "MMMM yyyy") : "Select Year"}
              </button>
              <button
                onClick={handleNextMonth}
                className="text-sm font-medium text-gray-700 hover:text-primary"
                disabled={disabledDays?.after && displayedMonth >= disabledDays.after}
              >
                <Icon icon="mdi:chevron-right" className="w-5 h-5" />
              </button>
            </div>
          )}
          {viewMode === "day" ? (
            <DayPicker
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleSelect}
              month={displayedMonth} // Control the displayed month/year based on selectedDate or default
              disabled={disabledMatcher && disabledMatcher.length > 0 ? disabledMatcher : undefined}
              showOutsideDays
              className="text-sm"
              classNames={{
                caption: 'hidden', // Tailwind class for hiding if using Tailwind
                caption_label: 'hidden',
                month_caption: 'hidden',
                nav: 'hidden', // Tailwind class for hiding if using Tailwind
                selected: "text-white bg-primary rounded-full",
              }}
              styles={{
                caption: { display: 'none' }, // Additional CSS to ensure caption is hidden
                nav: { display: 'none' }, // Additional CSS to ensure nav is hidden
              }}
            />
          ) : (
            <YearPicker />
          )}
        </div>
      )}
    </div>
  );
};

export default DatePickerInput;
