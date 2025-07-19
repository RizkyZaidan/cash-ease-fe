import { Icon } from '@iconify/react';
import React from 'react';

interface PaginationProps {
    count: number; // Total number of pages
    page: number;  // Current page (1-based)
    onPageChange: (page: number) => void; // Function to change the page (1-based)
}

const PaginationComponent: React.FC<PaginationProps> = ({ count, page, onPageChange }) => {
    // Internally convert to zero-based for logic
    const zeroBasedPage = page - 1;

    const handlePrevious = () => {
        if (zeroBasedPage > 0) {
            onPageChange(zeroBasedPage); // zeroBasedPage - 1 + 1 = zeroBasedPage
        }
    };

    const handleNext = () => {
        if (zeroBasedPage < count - 1) {
            onPageChange(zeroBasedPage + 2); // zeroBasedPage + 1 + 1
        }
    };

    // Helper function to generate the page numbers with "..."
    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const pages: (number | string)[] = [];

        // Show the first page (0)
        pages.push(0);

        if (zeroBasedPage > 2 && zeroBasedPage < count - 3) {
            pages.push('...');
            for (let i = zeroBasedPage - 2; i <= zeroBasedPage + 2; i++) {
                if (i >= 1 && i < count - 1) {
                    pages.push(i);
                }
            }
        } else if (zeroBasedPage <= 2) {
            for (let i = 1; i <= Math.min(maxPagesToShow - 1, count - 1); i++) {
                pages.push(i);
            }
        } else if (zeroBasedPage >= count - 3) {
            for (let i = count - maxPagesToShow + 1; i < count - 1; i++) {
                pages.push(i);
            }
        }

        if (count > 1 && pages[pages.length - 1] !== count - 1 && pages[pages.length - 2] !== '...') {
            pages.push('...');
            pages.push(count - 1);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 my-4">
            <button
                onClick={handlePrevious}
                className="sm:px-2 md:py-2 sm:py-1 bg-white hover:bg-primary hover:text-white text-gray-light disabled:bg-neutral-100 rounded-md"
                disabled={zeroBasedPage === 0}
            >
                <Icon icon="carbon:chevron-left" width={28} height={28} className="sm:text-xs md:text-lg text-gray-light" />
            </button>

            {getPageNumbers().map((item, index) => (
                <button
                    key={index}
                    onClick={() => {
                        if (typeof item === 'number' && zeroBasedPage !== item) {
                            onPageChange(item + 1); // convert zero-based to 1-based
                        }
                    }}
                    className={`md:px-4 sm:px-2 md:py-2 sm:py-1 rounded-md sm:text-xs md:text-lg ${
                        typeof item === 'number' && zeroBasedPage === item
                            ? 'bg-primary text-white cursor-default'
                            : 'bg-white hover:bg-primary hover:text-white text-gray-light'
                    }`}
                >
                    {typeof item === 'number' ? item + 1 : item}
                </button>
            ))}

            <button
                onClick={handleNext}
                className="sm:px-2 md:py-2 sm:py-1 sm:text-xs bg-white hover:bg-primary hover:text-white text-gray-light disabled:bg-neutral-100 rounded-md md:text-lg"
                disabled={zeroBasedPage === count - 1}
            >
                <Icon icon="carbon:chevron-right" width={28} height={28} className="sm:text-xs md:text-lg text-gray-light" />
            </button>
        </div>
    );
};

export default PaginationComponent;
