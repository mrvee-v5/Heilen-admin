import React from "react";
import { Modal } from "@/components/ui/modal"; // adjust this import to your actual modal component

interface ReusableModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    showCloseButton?: boolean;
    className?: string;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    showCloseButton = true,
    className = "max-w-[700px] m-4",
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={false}
            className={className}
        >
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-[#54392A] text-white px-5 py-3">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-white text-xl hover:text-gray-300"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div >{children}</div>

                    {/* Footer */}
                    {footer && (
                        <div className=" flex justify-end border-t border-gray-200">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ReusableModal;
