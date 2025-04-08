"use client";

import React, { useState } from "react";
import { EmojiGuesserData, GameState, ThemeConfig } from "../types";
import { useFarcaster } from "./FarcasterProvider";
import { useDappyKit } from "../utils/dappykit-context";
import { saveGameResult, NoSdkError } from "../utils/game-history";
import AnswersModal from "./modals/AnswersModal";
import PurchaseAttemptsModal from "./modals/PurchaseAttemptsModal";
import {
  ShareIcon,
  BookIcon,
  PlayAgainIcon,
  PlusIcon,
  SaveIcon,
} from "./icons";
import { generateShareIntent, getAppUrl } from "../utils/farcaster";
import { useAccount } from "wagmi";
import { SpinnerIcon } from "./icons/SpinnerIcon";

interface ResultsScreenProps {
  gameData?: EmojiGuesserData;
  gameState?: GameState;
  onRestart: () => void;
  onAddAttempts?: () => void;
  themeConfig?: ThemeConfig | null;
}

/**
 * Results screen showing game completion status and score with a modern design
 * Optimized for both mobile and desktop viewing
 */
export default function ResultsScreen({
  gameData,
  gameState,
  onRestart,
  onAddAttempts,
}: ResultsScreenProps) {
  const { sdk: farcasterSdk } = useFarcaster();
  const { sdk: dappyKitSdk, isInitialized } = useDappyKit();
  const { address, isConnected } = useAccount();
  const [showAnswersModal, setShowAnswersModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Calculate percentage score
  const scorePercentage =
    gameState?.score !== undefined && gameData?.guesses?.length
      ? Math.round((gameState.score / gameData.guesses.length) * 100)
      : 0;

  // Generate dynamic messages based on score
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

  // Get the appropriate emoji based on score
  const getResultEmoji = () => {
    if (gameState?.gameResult === "failure") return "😢";
    if (scorePercentage === 100) return "🏆";
    if (scorePercentage >= 80) return "🎉";
    if (scorePercentage >= 50) return "👍";
    return "🤔";
  };

  /**
   * Handles sharing the game results using Farcaster or fallback mechanisms
   */
  const handleShareResult = async () => {
    if (!gameData || !gameState) return;

    try {
      // Create custom share text for Emoji Guesser game
      const emoji =
        scorePercentage >= 90
          ? "🏆"
          : scorePercentage >= 70
            ? "🎉"
            : scorePercentage >= 50
              ? "👍"
              : "🤔";

      const shareText = `${emoji} I solved ${gameState.score}/${gameData.guesses.length} emoji puzzles (${scorePercentage}%) in Emoji Guesser! Can you beat my score?`;

      // Get the app URL to embed
      const appUrl = getAppUrl();

      // Generate the Farcaster intent URL
      const intentUrl = generateShareIntent(shareText, appUrl);

      // Try to use Farcaster SDK if available
      if (farcasterSdk?.actions?.openUrl) {
        await farcasterSdk.actions.openUrl(intentUrl);
      } else {
        // Open the URL directly as fallback
        window.open(intentUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error sharing result:", error);
      // Show fallback UI or handle errors silently
      // Avoiding alerts due to sandboxed environment restrictions
    }
  };

  /**
   * Toggle the answers modal visibility
   */
  const toggleAnswersModal = () => {
    setShowAnswersModal(!showAnswersModal);
  };

  /**
   * Toggle the purchase modal visibility
   */
  const togglePurchaseModal = () => {
    setShowPurchaseModal(!showPurchaseModal);
  };

  /**
   * Handle transaction success
   */
  const handleTransactionSuccess = () => {
    setTransactionSuccess(true);
    setTransactionError(null);

    // Wait a moment before adding attempts
    setTimeout(() => {
      if (onAddAttempts) {
        onAddAttempts();
      }
      setTransactionSuccess(false);
      setShowPurchaseModal(false);
    }, 2000);
  };

  /**
   * Handle transaction error
   */
  const handleTransactionError = (errorMessage: string) => {
    setTransactionError(errorMessage);
    setTransactionSuccess(false);
    // Do not add attempts if transaction failed or was rejected
  };

  /**
   * Handles saving the game progress to DappyKit
   */
  const handleSaveProgress = async () => {
    if (!gameState || !gameData || !isInitialized) return;

    if (!address) {
      setSaveError("Please connect your wallet to save progress");
      return;
    }

    setSavingProgress(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      // Prepare game result data
      const gameResult = {
        timestamp: Date.now(),
        score: gameState.score,
        totalAttempts: gameData.attempts_per_game,
        attemptsUsed:
          gameData.attempts_per_game - (gameState.attemptsRemaining || 0),
        title: gameData.title,
        gameId: gameData.id,
      };

      // Save to DappyKit - the function now throws errors instead of returning boolean
      await saveGameResult(dappyKitSdk, address as string, gameResult);

      // If we get here, it means save was successful
      setSaveSuccess(true);

      // Reset the success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving game progress:", error);

      if (error instanceof NoSdkError) {
        setSaveError("DappyKit SDK not initialized");
      } else {
        setSaveError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      }
    } finally {
      setSavingProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
        {/* Game Header with Trophy and Game Complete */}
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            <div className="text-7xl transform hover:scale-110 transition-transform duration-300">
              {getResultEmoji()}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 text-transparent">
            {gameState?.gameResult === "success"
              ? "Game Complete!"
              : "Game Over"}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {getResultMessage()}
          </p>

          {/* Share Results button moved to top */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleShareResult}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg transition-all transform hover:scale-105 shine w-full sm:w-auto justify-center"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share Results
            </button>

            {/* Save Progress button */}
            <button
              onClick={handleSaveProgress}
              disabled={savingProgress || !isInitialized}
              className={`mt-3 px-6 py-3 ${
                saveSuccess
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : saveError
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500"
              } text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg transition-all transform hover:scale-105 w-full sm:w-auto disabled:opacity-70`}
            >
              {savingProgress ? (
                <>
                  <div className="flex items-center justify-center w-full space-x-2">
                    <SpinnerIcon className="h-5 w-5 text-white" />
                    <span>Saving...</span>
                  </div>
                </>
              ) : saveSuccess ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 inline"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <SaveIcon className="h-5 w-5 mr-2 inline" />
                  {saveError ? "Save Failed" : "Save Progress"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Score card with improved visual design */}
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
                          ? gameData.attempts_per_game -
                            gameState.attemptsRemaining
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

            {/* Action buttons in a vertical stack on mobile, horizontal on larger screens */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={toggleAnswersModal}
                className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-teal-600 transition-colors flex items-center justify-center shadow-md"
              >
                <BookIcon className="h-5 w-5 mr-1.5" />
                View Answers
              </button>

              {/* Play Again button moved to score card */}
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
          </div>
        </div>

        {/* Modals */}
        <AnswersModal
          isOpen={showAnswersModal}
          onClose={toggleAnswersModal}
          gameData={gameData}
          gameState={gameState}
        />

        {gameData && (
          <PurchaseAttemptsModal
            gameData={gameData}
            isOpen={showPurchaseModal}
            onClose={togglePurchaseModal}
            onTransactionSuccess={handleTransactionSuccess}
            onTransactionError={handleTransactionError}
            transactionError={transactionError}
            transactionSuccess={transactionSuccess}
            isConnected={isConnected}
          />
        )}
      </div>
    </div>
  );
}
