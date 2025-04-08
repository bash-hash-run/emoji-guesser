import React from "react";
import { ShareIcon, SaveIcon } from "../icons";
import { SpinnerIcon } from "../icons/SpinnerIcon";
import { EmojiGuesserData, GameState } from "../../types";
import { generateShareIntent, getAppUrl } from "../../utils/farcaster";

interface FarcasterSdk {
  actions?: {
    openUrl?: (url: string) => Promise<void>;
  };
}

interface ActionButtonsProps {
  gameData?: EmojiGuesserData;
  gameState?: GameState;
  farcasterSdk: FarcasterSdk | null;
  savingProgress: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  onSaveProgress: () => void;
}

/**
 * Displays the share and save buttons at the top of the results screen
 */
export function ActionButtons({
  gameData,
  gameState,
  farcasterSdk,
  savingProgress,
  saveSuccess,
  saveError,
  onSaveProgress,
}: ActionButtonsProps) {
  // Calculate percentage score
  const scorePercentage =
    gameState?.score !== undefined && gameData?.guesses?.length
      ? Math.round((gameState.score / gameData.guesses.length) * 100)
      : 0;

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

  return (
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
        onClick={onSaveProgress}
        disabled={savingProgress}
        className={`sm:mt-0 px-6 py-3 ${
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
  );
}
