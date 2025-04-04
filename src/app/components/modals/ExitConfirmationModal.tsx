import React from "react";
import { WarningIcon } from "../icons";

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Modal for confirming exit from the game
 */
export default function ExitConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: ExitConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
          <h2 className="text-lg font-bold text-white">Exit Game?</h2>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <WarningIcon className="h-6 w-6 text-orange-500 mr-2" />
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to exit the game? Your current progress will
              be lost.
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-colors font-medium"
            >
              Exit Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
