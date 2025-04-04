import React from "react";
import { EmojiGuesserData, GameState } from "../../types";
import { CloseIcon } from "../icons";

interface AnswersModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameData?: EmojiGuesserData;
  gameState?: GameState;
}

/**
 * Modal that displays all answers from the game
 */
export default function AnswersModal({
  isOpen,
  onClose,
  gameData,
  gameState,
}: AnswersModalProps) {
  if (!isOpen || !gameData || !gameState) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">All Answers</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-4">
            {gameData.guesses.map((guess, index) => {
              const userAnswer = gameState.answers[index] || "";
              const isCorrect =
                userAnswer.toLowerCase().trim() === guess.answer.toLowerCase();

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl mb-2">{guess.emojis}</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isCorrect
                          ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                          : "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Hint:
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {guess.hint}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Your Answer:
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {userAnswer || "(No answer)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Correct Answer:
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {guess.answer}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    {guess.result_description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
