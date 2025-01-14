import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Displays a customizable toast notification with optional Confirm and Cancel buttons.
 * @param {Object} options - Configuration options for the toast.
 * @param {string} options.message - The warning message to display.
 * @param {string} [options.confirmText] - Text for the Confirm button (optional).
 * @param {string} [options.confirmFunction] - Name of the Confirm function in the functionsMap (optional).
 * @param {string} [options.cancelText] - Text for the Cancel button (optional).
 * @param {string} [options.cancelFunction] - Name of the Cancel function in the functionsMap (optional).
 * @param {Object} options.functionsMap - A mapping of function names to actual function references.
 */
export function showToastNotification({
    message,
    confirmText,
    confirmFunction,
    cancelText,
    cancelFunction,
    functionsMap,
}) {
    toast.error(
        <div>
            <p>{message}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                {cancelText && cancelFunction && functionsMap[cancelFunction] && (
                    <button
                        style={{
                            padding: '5px 10px',
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            toast.dismiss(); // Close the toast
                            functionsMap[cancelFunction](); // Call the cancel function
                        }}
                    >
                        {cancelText}
                    </button>
                )}
                {confirmText && confirmFunction && functionsMap[confirmFunction] && (
                    <button
                        style={{
                            padding: '5px 10px',
                            background: '#247BA0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            toast.dismiss(); // Close the toast
                            functionsMap[confirmFunction](); // Call the confirm function
                        }}
                    >
                        {confirmText}
                    </button>
                )}
            </div>
        </div>,
        {
            position: 'top-center',
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        }
    );
}
