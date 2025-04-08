import React from "react";
import { EmojiGuesserData, GameState } from "../../types";

interface StatsDisplayProps {
  gameData?: EmojiGuesserData;
  gameState?: GameState;
}

/**
 * Displays game statistics in a grid layout
 */
export function StatsDisplay({ gameData, gameState }: StatsDisplayProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        {gameState?.gameResult === "failure" ? (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-1">
                Total Emoji Puzzles
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {gameData?.guesses.length}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="text-teal-600 dark:text-teal-300 text-sm font-medium mb-1">
                Correct Answers
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {gameState?.score}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="text-red-600 dark:text-red-300 text-sm font-medium mb-1">
                Mistakes Made
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {gameData && gameState
                  ? gameData.attempts_per_game - gameState.attemptsRemaining
                  : 0}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="text-amber-600 dark:text-amber-300 text-sm font-medium mb-1">
                Attempts Left
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {gameState?.attemptsRemaining}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
