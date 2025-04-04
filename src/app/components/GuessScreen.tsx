import React, { useState, useRef, useEffect } from "react";
import { EmojiGuesserData, GameState, ThemeConfig } from "../types";
import { useAccount } from "wagmi";
import PurchaseAttemptsModal from "./modals/PurchaseAttemptsModal";
import ExitConfirmationModal from "./modals/ExitConfirmationModal";
import { InfoIcon } from "./icons";

interface GuessScreenProps {
  gameData: EmojiGuesserData;
  gameState: GameState;
  onAnswer: (answer: string) => void;
  onUseHint: () => void;
  onAddAttempts: () => void;
  onExitGame: () => void;
  themeConfig?: ThemeConfig | null;
}

/**
 * Component displaying the current emoji challenge with a modern, minimalist design
 */
export default function GuessScreen({
  gameData,
  gameState,
  onAnswer,
  onUseHint,
  onAddAttempts,
  onExitGame,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  themeConfig,
}: GuessScreenProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showError, setShowError] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [shakeAttemptsButton, setShakeAttemptsButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isConnected } = useAccount();

  const currentGuess = gameData.guesses[gameState.currentGuessIndex];

  // Focus input when component mounts or guess changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Reset states when moving to a new guess
    setUserAnswer("");
    setShowError(false);
    setIsCorrect(null);
    setShakeInput(false);
  }, [gameState.currentGuessIndex]);

  // Handle answer submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userAnswer.trim()) {
      setShowError(true);
      return;
    }

    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = currentGuess.answer.toLowerCase();

    const correct = normalizedUserAnswer === normalizedCorrectAnswer;
    setIsCorrect(correct);

    if (!correct) {
      // Shake input field and clear user's answer
      setShakeInput(true);
      // Clear user answer after a brief delay
      setTimeout(() => {
        setUserAnswer("");
        setShakeInput(false);
      }, 500);

      // Shake attempts button - now shake it regardless of attempts count
      setShakeAttemptsButton(true);
      setTimeout(() => {
        setShakeAttemptsButton(false);
      }, 500);
    }

    // Use timeout to show the result feedback before moving to next guess
    setTimeout(() => {
      onAnswer(userAnswer);
      setIsCorrect(null);
    }, 1000);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
    if (showError && e.target.value.trim()) {
      setShowError(false);
    }
  };

  // Handle hint usage
  const handleHintClick = () => {
    onUseHint();
  };

  // Handle purchase modal show
  const handlePurchaseClick = () => {
    setShowPurchaseModal(true);
  };

  // Close purchase modal
  const handleCloseModal = () => {
    setShowPurchaseModal(false);
  };

  // Show exit confirmation modal
  const handleExitClick = () => {
    setShowExitConfirmation(true);
  };

  // Close exit confirmation modal
  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  // Confirm exit and return to welcome screen
  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    onExitGame();
  };

  // Handle transaction success
  const handleTransactionSuccess = () => {
    setTransactionSuccess(true);
    setTransactionError(null);

    // Wait a moment before adding attempts and closing modal
    setTimeout(() => {
      onAddAttempts();
      setShowPurchaseModal(false);
      setTransactionSuccess(false);
    }, 2000);
  };

  // Handle transaction error
  const handleTransactionError = (errorMessage: string) => {
    setTransactionError(errorMessage);
    setTransactionSuccess(false);
    // Do not add attempts if transaction failed
  };

  // Determine input state class
  const getInputStateClass = () => {
    if (isCorrect === true)
      return "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20";
    if (isCorrect === false)
      return "ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20";
    if (showError) return "ring-2 ring-red-500";
    return "focus:ring-2 focus:ring-teal-500";
  };

  // Generate progress percentage
  const progressPercentage =
    (gameState.currentGuessIndex / gameData.guesses.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
      {/* Game header with progress */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1
              className="text-lg font-bold text-indigo-800 dark:text-indigo-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-200 transition-colors"
              onClick={handleExitClick}
            >
              {gameData.title}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 text-sm font-medium rounded-full">
                Score: {gameState.score}/{gameData.guesses.length}
              </span>
              <div
                onClick={handlePurchaseClick}
                className={`flex items-center gap-1 px-3 py-1.5 
                  ${
                    gameState.attemptsRemaining <= 3
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white"
                      : "bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-600 hover:to-teal-500 text-white"
                  } 
                  text-sm font-medium rounded-full cursor-pointer shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 shine-button relative overflow-hidden
                  ${shakeAttemptsButton ? "animate-shake" : ""}`}
              >
                <span className="relative z-10">
                  Attempts: {gameState.attemptsRemaining}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
            <span>
              Puzzle {gameState.currentGuessIndex + 1} of{" "}
              {gameData.guesses.length}
            </span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden">
            {/* Emoji display */}
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-10 md:p-16 flex items-center justify-center">
              <span
                className="text-7xl md:text-8xl"
                role="img"
                aria-label="Emojis to guess"
              >
                {currentGuess.emojis}
              </span>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-6">
                What does this emoji combination represent?
              </h2>

              {/* Hint section */}
              {gameState.usedHints[gameState.currentGuessIndex] && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InfoIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 dark:text-yellow-200">
                        Hint: {currentGuess.hint}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User input */}
                <div>
                  <label
                    htmlFor="answer"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Your answer:
                  </label>
                  <input
                    type="text"
                    id="answer"
                    name="answer"
                    ref={inputRef}
                    value={userAnswer}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 transition-all duration-200 ${getInputStateClass()} ${shakeInput ? "animate-shake" : ""}`}
                    placeholder="Type your answer..."
                  />
                  {showError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      Please enter an answer
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    Submit Answer
                  </button>

                  <button
                    type="button"
                    onClick={handleHintClick}
                    disabled={gameState.usedHints[gameState.currentGuessIndex]}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
                      ${
                        gameState.usedHints[gameState.currentGuessIndex]
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                      }`}
                  >
                    {gameState.usedHints[gameState.currentGuessIndex]
                      ? "Hint Used"
                      : "Use Hint"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PurchaseAttemptsModal
        gameData={gameData}
        isOpen={showPurchaseModal}
        onClose={handleCloseModal}
        onTransactionSuccess={handleTransactionSuccess}
        onTransactionError={handleTransactionError}
        transactionError={transactionError}
        transactionSuccess={transactionSuccess}
        isConnected={isConnected}
      />

      <ExitConfirmationModal
        isOpen={showExitConfirmation}
        onClose={handleCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
