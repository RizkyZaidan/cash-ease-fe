"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Icon } from "@iconify/react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid, setYear, addMonths, subMonths } from "date-fns";
import "react-day-picker/dist/style.css";

interface DatePickerButtonProps {
    value?: Date | string | null;
    onChange?: (date: Date | null) => void;
    onDaysButtonTriggered?: (date: Date | null) => void; // New prop
    dateFormat?: string;
    disabledDays?: { before?: Date; after?: Date };
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    id?: string;
    buttonClassName?: string; // Additional class for the button
    icon?: string; // Icon for the button, default to calendar
}

const DatePickerButton: React.FC<DatePickerButtonProps> = ({
    value,
    onChange,
    onDaysButtonTriggered, // Use the new prop
    dateFormat = "yyyy-MM-dd",
    disabledDays,
    className = "",
    placeholder = "Select date",
    disabled = false,
    required = false,
    name,
    id,
    buttonClassName = "",
    icon = "lets-icons:calendar",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
        if (!value) return null;
        if (typeof value === "string") {
            const parsed = parse(value, "dd-MM-yyyy", new Date());
            return isValid(parsed) ? parsed : null;
        }
        return isValid(value) ? value : null;
    });
    const [viewMode, setViewMode] = useState<"day" | "year">("day");
    const [currentYear, setCurrentYear] = useState<number>(
        selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()
    );
    const [displayedMonth, setDisplayedMonth] = useState<Date>(
        selectedDate && isValid(selectedDate) ? selectedDate : new Date()
    );

    const buttonRef = useRef<HTMLButtonElement>(null);
    const yearContainerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value === null) {
            return;
        }
        if (value === undefined) {
            setSelectedDate(null);
            setDisplayedMonth(new Date());
        } else if (typeof value === "string") {
            const parsed = parse(value, "dd-MM-yyyy", new Date());
            setSelectedDate(isValid(parsed) ? parsed : null);
            if (isValid(parsed)) {
                setCurrentYear(parsed.getFullYear());
                setDisplayedMonth(parsed);
            }
        } else if (isValid(value)) {
            setSelectedDate(value);
            setCurrentYear(value.getFullYear());
            setDisplayedMonth(value);
        } else {
            setSelectedDate(null);
            setDisplayedMonth(new Date());
        }
    }, [value]);

    useEffect(() => {
        if (currentYear !== (selectedDate ? selectedDate.getFullYear() : null)) {
            if (selectedDate && isValid(selectedDate)) {
                const newDate = setYear(selectedDate, currentYear);
                setSelectedDate(newDate);
                setDisplayedMonth(newDate);
                if (newDate !== null) {
                    onChange?.(newDate);
                }
            } else {
                const newDate = new Date(currentYear, 0, 1);
                setSelectedDate(newDate);
                setDisplayedMonth(newDate);
                onChange?.(newDate);
            }
        }
    }, [currentYear, selectedDate, onChange]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", (event) => {
                const pickerEl = document.getElementById("datepicker-portal-popup");
                if (
                    pickerEl &&
                    !pickerEl.contains(event.target as Node) &&
                    buttonRef.current &&
                    !buttonRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                }
            });
        }
        return () => {
            document.removeEventListener("mousedown", (event) => {
                if (isOpen) {
                    document.removeEventListener("mousedown", null!);
                }
            });
        };
    }, [isOpen]);

    useEffect(() => {
        if (viewMode === "year" && yearContainerRef.current) {
            const selectedYearElement = yearContainerRef.current.querySelector(
                `button[data-year="${currentYear}"]`
            );
            if (selectedYearElement) {
                selectedYearElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [viewMode, currentYear]);

    const handleSelect = (date: Date | undefined) => {
        const newDate = date || null;
        setSelectedDate(newDate);
        setIsOpen(false);
        if (newDate) {
            setCurrentYear(newDate.getFullYear());
            setDisplayedMonth(newDate);
        }
        onDaysButtonTriggered?.(newDate); // Call the new prop here
        onChange?.(newDate);
    };

    const handleYearSelect = (year: number) => {
        const newDate = selectedDate ? setYear(selectedDate, year) : new Date(year, 0, 1);
        setSelectedDate(newDate);
        setCurrentYear(year);
        setDisplayedMonth(newDate);
        setViewMode("day");
        onChange?.(newDate);
    };

    const handlePrevMonth = () => {
        const newMonth = subMonths(displayedMonth, 1);
        setDisplayedMonth(newMonth);
        if (selectedDate) {
            const newDate = subMonths(selectedDate, 1);
            setSelectedDate(newDate);
            setCurrentYear(newDate.getFullYear());
            onChange?.(newDate);
        }
    };

    const handleNextMonth = () => {
        const newMonth = addMonths(displayedMonth, 1);
        setDisplayedMonth(newMonth);
        if (selectedDate) {
            const newDate = addMonths(selectedDate, 1);
            setSelectedDate(newDate);
            setCurrentYear(newDate.getFullYear());
            onChange?.(newDate);
        }
    };

    const toggleYearView = () => {
        setViewMode(viewMode === "day" ? "year" : "day");
    };

    const displayValue = selectedDate && isValid(selectedDate) ? format(selectedDate, dateFormat) : "";

    const disabledMatcher = disabledDays
        ? [
            ...(disabledDays.before ? [{ before: disabledDays.before }] : []),
            ...(disabledDays.after ? [{ after: disabledDays.after }] : []),
        ]
        : undefined;

    const YearPicker = () => {
        const startYear = 1900;
        const endYear = new Date().getFullYear();
        const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).reverse();

        return (
            <div
                ref={yearContainerRef}
                className="grid grid-cols-4 gap-2 p-2 max-h-64 overflow-y-auto"
            >
                <h3 className="col-span-4 text-center text-sm font-medium text-gray-700 mb-2">
                    Select Year
                </h3>
                {years.map((year) => (
                    <button
                        key={year}
                        data-year={year}
                        onClick={() => handleYearSelect(year)}
                        className={`p-2 text-sm rounded-md hover:bg-gray-100 ${currentYear === year ? "bg-primary text-white" : "text-gray-700"
                            }`}
                        type="button"
                    >
                        {year}
                    </button>
                ))}
            </div>
        );
    };

    const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const popupWidth = 320;
            const popupHeight = 350;

            let left = rect.left + window.scrollX;
            let top = rect.bottom + window.scrollY + 4;

            if (left + popupWidth > viewportWidth - 8) {
                left = Math.max(8, viewportWidth - popupWidth - 8) + window.scrollX;
            }

            if (left < 8) {
                left = 8 + window.scrollX;
            }

            if (top + popupHeight > viewportHeight + window.scrollY) {
                top = rect.top + window.scrollY - popupHeight - 4;
            }

            setPopupStyle({
                position: "absolute",
                top,
                left,
                zIndex: 9999,
                minWidth: rect.width,
                maxWidth: popupWidth,
            });
        }
    }, [isOpen]);

    return (
        <div className={`relative inline-block ${className}`}>
            <button
                type="button"
                ref={buttonRef}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                className={`min-w-36 h-input-standard bg-primary flex items-center justify-center gap-2 border border-input-gray rounded-md px-3 py-2 cursor-pointer text-sm w-full sm:w-auto ${disabled
                    ? "bg-gray-100 cursor-not-allowed opacity-70 text-gray-400"
                    : "hover:ring-1 hover:ring-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    } ${buttonClassName}`}
                name={name}
                id={id}
                aria-required={required}
            >
                <Icon icon={icon} className="w-5 h-5 text-white" />
                <span className={`${displayValue ? "text-white" : "text-white"}`}>
                    {value !== null ? displayValue : placeholder}
                </span>
            </button>

            {isOpen &&
                buttonRef.current &&
                ReactDOM.createPortal(
                    <div
                        id="datepicker-portal-popup"
                        ref={popupRef}
                        style={popupStyle}
                        className="bg-white shadow-lg rounded-lg border border-gray-200 p-2"
                    >
                        {viewMode === "day" && (
                            <div className="flex justify-between items-center mb-3">
                                <button
                                    onClick={handlePrevMonth}
                                    className="text-sm font-medium text-gray-700 hover:text-primary"
                                    disabled={disabledDays?.before && displayedMonth <= disabledDays.before}
                                    aria-label="Previous month"
                                    type="button"
                                >
                                    <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={toggleYearView}
                                    className="text-lg font-medium text-gray-700 hover:text-primary"
                                    aria-label="Toggle year view"
                                    type="button"
                                >
                                    {selectedDate ? format(selectedDate, "MMMM yyyy") : "Select Year"}
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="text-sm font-medium text-gray-700 hover:text-primary"
                                    disabled={disabledDays?.after && displayedMonth >= disabledDays.after}
                                    aria-label="Next month"
                                    type="button"
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
                                month={displayedMonth}
                                disabled={disabledMatcher && disabledMatcher.length > 0 ? disabledMatcher : undefined}
                                showOutsideDays
                                className="text-sm"
                                classNames={{
                                    caption: "hidden",
                                    caption_label: "hidden",
                                    month_caption: "hidden",
                                    nav: "hidden",
                                    selected: "text-white bg-primary rounded-full",
                                }}
                                styles={{
                                    caption: { display: "none" },
                                    nav: { display: "none" },
                                }}
                            />
                        ) : (
                            <YearPicker />
                        )}
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default DatePickerButton;