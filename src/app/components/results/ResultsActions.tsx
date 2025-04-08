import React from "react";
import { GameState } from "../../types";
import { BookIcon, PlayAgainIcon, PlusIcon } from "../icons";

interface ResultsActionsProps {
  gameState?: GameState;
  onRestart: () => void;
  toggleAnswersModal: () => void;
  togglePurchaseModal: () => void;
}

/**
 * Displays action buttons for the results screen like View Answers and Play Again
 */
export function ResultsActions({
  gameState,
  onRestart,
  toggleAnswersModal,
  togglePurchaseModal,
}: ResultsActionsProps) {
  return (
    <>
      {/* Action buttons in a vertical stack on mobile, horizontal on larger screens */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={toggleAnswersModal}
          className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-teal-600 transition-colors flex items-center justify-center shadow-md"
        >
          <BookIcon className="h-5 w-5 mr-1.5" />
          View Answers
        </button>

        <button
          onClick={onRestart}
          className="px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium rounded-lg hover:from-orange-600 hover:to-yellow-500 transition-colors flex items-center justify-center shadow-md transform hover:scale-105 duration-200"
        >
          <PlayAgainIcon className="h-5 w-5 mr-1.5" />
          Play Again
        </button>
      </div>

      {/* Add another button for "Buy More Attempts" if game result is failure */}
      {gameState?.gameResult === "failure" && (
        <div className="mt-4">
          <button
            onClick={togglePurchaseModal}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-medium rounded-lg hover:from-amber-600 hover:to-yellow-500 transition-colors flex items-center justify-center shadow-md"
          >
            <PlusIcon className="h-5 w-5 mr-1.5" />
            Buy More Attempts
          </button>
        </div>
      )}
    </>
  );
}
