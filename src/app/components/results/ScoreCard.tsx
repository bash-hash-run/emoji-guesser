import React from "react";
import { EmojiGuesserData, GameState } from "../../types";
import { StatsDisplay } from "./StatsDisplay";
import { ResultsActions } from "./ResultsActions";

interface ScoreCardProps {
  gameData?: EmojiGuesserData;
  gameState?: GameState;
  onRestart: () => void;
  toggleAnswersModal: () => void;
  togglePurchaseModal: () => void;
}

/**
 * Displays the score card with game statistics and action buttons
 */
export default function ScoreCard({
  gameData,
  gameState,
  onRestart,
  toggleAnswersModal,
  togglePurchaseModal,
}: ScoreCardProps) {
  // Calculate percentage score
  const scorePercentage =
    gameState?.score !== undefined && gameData?.guesses?.length
      ? Math.round((gameState.score / gameData.guesses.length) * 100)
      : 0;

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden mb-6 transform hover:scale-[1.01] transition-all duration-300 animated-border">
      <div className="bg-gradient-to-r from-indigo-600 to-teal-500 p-6 relative overflow-hidden">
        <h2 className="text-white text-2xl font-bold text-center mb-2">
          Your Score
        </h2>
        <p className="text-white/80 text-center mb-4">
          {gameState?.score} correct out of {gameData?.guesses.length} total
        </p>

        {/* Score percentage circle - only shown for failure cases */}
        {gameState?.gameResult === "failure" && (
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-full h-28 w-28 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-br from-indigo-500 to-teal-500 bg-clip-text text-transparent">
                  {scorePercentage}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success indicator for perfect score */}
        {gameState?.gameResult === "success" && (
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-full h-28 w-28 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-5xl font-bold">🏆</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        {/* Stats boxes in a responsive grid */}
        <StatsDisplay gameData={gameData} gameState={gameState} />

        {/* Action buttons */}
        <ResultsActions
          gameState={gameState}
          onRestart={onRestart}
          toggleAnswersModal={toggleAnswersModal}
          togglePurchaseModal={togglePurchaseModal}
        />
      </div>
    </div>
  );
}
