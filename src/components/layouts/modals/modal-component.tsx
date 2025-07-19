import React, { ReactNode, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface ModalComponentProps {
    isOpen: boolean;
    title: string;
    closeIcon?: ReactNode | null;
    onClose: () => void;
    onSave: () => void;
    children: ReactNode;
    buttonSaveTitle?: string | null;
    showCancelButton?: boolean;
    customActionButton?: ReactNode | null;
    loading: boolean;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
    isOpen,
    onClose,
    onSave,
    title,
    children,
    closeIcon = null,
    buttonSaveTitle = 'Simpan',
    showCancelButton = false,
    customActionButton = null,
    loading,
}) => {
    // Disable body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        // Cleanup on unmount or when modal closes
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        // Overlay (background)
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose} // Close modal when clicking outside
        >
            {/* Modal Content */}
            <div
                className="bg-white rounded-lg w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-w-2xl p-4 sm:p-6 md:p-8 shadow-lg relative max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div className="relative flex items-center mb-3 sm:mb-4 md:mb-5">
                    <span className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl text-black">
                        {title}
                    </span>
                    <div className="ml-auto">
                        {closeIcon ? (
                            closeIcon
                        ) : (
                            <button
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <Icon
                                    icon="material-symbols:close-rounded"
                                    width="20"
                                    height="20"
                                    className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                                />
                            </button>
                        )}
                    </div>
                </div>


                {/* Content */}
                <div className="mb-6 sm:mb-4 md:mb-6 text-sm sm:text-base md:text-lg">
                    {children}
                </div>

                {/* Footer (Action Buttons) */}
                <div className="flex flex-row gap-2 sm:gap-3 md:gap-4">
                    {customActionButton ? (
                        customActionButton
                    ) : (
                        <>
                            {showCancelButton && (
                                <button
                                    className="w-full px-3 py-1 sm:px-4 sm:py-2 border border-primary rounded-md text-primary font-semibold hover:bg-gray-100 text-xs sm:text-sm md:text-base lg:text-lg"
                                    onClick={onClose}
                                >
                                    Batal
                                </button>
                            )}
                            <button
                                disabled={loading}
                                className="w-full px-3 py-1 sm:px-4 sm:py-2 min-w-24 bg-primary text-white rounded-md font-semibold hover:bg-success transition duration-500 ease-in-out text-xs sm:text-sm md:text-base lg:text-lg"
                                onClick={() => {
                                    onSave();
                                }}
                            >
                                {!loading &&
                                    (buttonSaveTitle || 'Simpan')
                                }
                                {loading &&
                                    (
                                        <Icon
                                            icon="ph:spinner"
                                            className="animate-spin h-5 w-5 text-white mx-auto"
                                        />
                                    )
                                }
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;
