import React from "react";
import { EmojiGuesserData, GameState } from "../../types";

interface ResultsHeaderProps {
  gameData?: EmojiGuesserData;
  gameState?: GameState;
}

/**
 * Displays the header section of the results screen with emoji and completion message
 */
export default function ResultsHeader({
  gameData,
  gameState,
}: ResultsHeaderProps) {
  // Calculate percentage score
  const scorePercentage =
    gameState?.score !== undefined && gameData?.guesses?.length
      ? Math.round((gameState.score / gameData.guesses.length) * 100)
      : 0;

  /**
   * Returns an appropriate result message based on the score percentage
   */
  const getResultMessage = () => {
    if (gameState?.gameResult === "failure") {
      return "You've run out of attempts! Try again or purchase more attempts.";
    }

    if (scorePercentage === 100) {
      return "Perfect score! You're an emoji master!";
    } else if (scorePercentage >= 80) {
      return "Great job! You really know your emojis!";
    } else if (scorePercentage >= 50) {
      return "Not bad! Keep practicing your emoji skills!";
    } else {
      return "Good try! Emojis can be tricky sometimes!";
    }
  };

  /**
   * Returns an appropriate emoji based on the score percentage
   */
  const getResultEmoji = () => {
    if (gameState?.gameResult === "failure") return "😢";
    if (scorePercentage === 100) return "🏆";
    if (scorePercentage >= 80) return "🎉";
    if (scorePercentage >= 50) return "👍";
    return "🤔";
  };

  return (
    <div className="text-center mb-6">
      <div className="mb-4 flex justify-center">
        <div className="text-7xl transform hover:scale-110 transition-transform duration-300">
          {getResultEmoji()}
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 text-transparent">
        {gameState?.gameResult === "success" ? "Game Complete!" : "Game Over"}
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        {getResultMessage()}
      </p>
    </div>
  );
}
