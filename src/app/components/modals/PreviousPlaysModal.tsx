"use client";

import { useState, useEffect } from "react";
import { useDappyKit } from "../../utils/dappykit-context";
import {
  getGameHistory,
  NoMultihashError,
  IpfsRetrievalError,
} from "../../utils/game-history";
import { useAccount } from "wagmi";

interface PreviousPlaysModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

interface PlayData {
  timestamp: number;
  score: number;
  totalAttempts: number;
  attemptsUsed: number;
  title?: string;
  gameId?: string;
}

/**
 * Modal that displays the user's previous plays retrieved from DappyKit/IPFS
 * @param props - Component props
 * @returns Previous Plays Modal component
 */
export default function PreviousPlaysModal({
  isOpen,
  onCloseAction,
}: PreviousPlaysModalProps) {
  const { address } = useAccount();
  const { sdk, isInitialized } = useDappyKit();
  const [isLoading, setIsLoading] = useState(false);
  const [multihash, setMultihash] = useState<string | null>(null);
  const [previousPlays, setPreviousPlays] = useState<PlayData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMultihashError, setIsMultihashError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isInitialized || !sdk || !isOpen || !address) return;

      setIsLoading(true);
      setError(null);
      setPreviousPlays(null);
      setMultihash(null);
      setIsMultihashError(false);

      try {
        // Use getGameHistory directly to get game history and handle errors
        const history = await getGameHistory(sdk, address as string);

        // If we get here, it means we successfully got the history
        setPreviousPlays(history.plays);

        // Also get the multihash for display
        const userMultihash =
          await sdk.filesystemChanges.getUserChangeMultihash(address as string);
        if (userMultihash) {
          // Format multihash for display
          const formattedMultihash = userMultihash.hash.startsWith("0x")
            ? userMultihash.hash.slice(2)
            : userMultihash.hash;
          setMultihash(formattedMultihash);
        }
      } catch (error) {
        if (error instanceof NoMultihashError) {
          // This is not a critical error - just means no previous plays
          setError("No previous plays found for this account");
          setIsMultihashError(true);
        } else if (error instanceof IpfsRetrievalError) {
          // This means we found the multihash but couldn't retrieve or parse the data
          setError(`Unable to retrieve play data: ${error.message}`);
        } else {
          // Any other error
          setError(
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isInitialized, sdk, isOpen, address]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            My Previous Plays
          </h2>
          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Retrieving your previous plays...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              {isMultihashError ? (
                // No multihash error (not critical) - show in gray/blue
                <>
                  <div className="text-blue-500 text-4xl mb-4">ℹ️</div>
                  <p className="text-blue-500 mb-2 font-bold">Information</p>
                  <p className="text-gray-600 dark:text-gray-400">{error}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Save a game result to see your play history.
                  </p>
                </>
              ) : (
                // Other errors - show in red
                <>
                  <div className="text-red-500 text-4xl mb-4">⚠️</div>
                  <p className="text-red-500 mb-2 font-bold">Error</p>
                  <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </>
              )}
            </div>
          ) : (
            <>
              {multihash && (
                <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Content Identifier (Multihash):
                  </p>
                  <code className="text-xs break-all">{multihash}</code>
                </div>
              )}

              {previousPlays && previousPlays.length > 0 ? (
                <div className="space-y-4">
                  {previousPlays.map((play, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded p-3"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          {play.title || `Game #${index + 1}`}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(play.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Score:{" "}
                          <span className="font-medium">{play.score || 0}</span>
                        </div>
                        <div>
                          Attempts:{" "}
                          <span className="font-medium">
                            {play.attemptsUsed || 0}/{play.totalAttempts || 5}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : previousPlays ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    No previous plays found
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onCloseAction}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
