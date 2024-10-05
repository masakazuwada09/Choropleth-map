import React from 'react';
import FlatIcon from '../../../../../components/FlatIcon';

const Modal = ({ title, children, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 w-[400px] ml-[190px] h-[100px] mt-[280px] shadow-lg border">
            <div className="bg-white rounded-sm w-full max-w-md mx-auto border">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition"
                    >
                        <FlatIcon icon="fi fi-rr-cross-small" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-4">{children}</div>

                {/* Modal Footer */}
                <div className="flex justify-end items-center p-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-2 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;