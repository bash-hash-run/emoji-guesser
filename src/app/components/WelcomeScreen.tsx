import React from "react";
import { EmojiGuesserData, ThemeConfig } from "../types";
import { useFarcaster } from "./FarcasterProvider";
import Image from "next/image";

interface WelcomeScreenProps {
  gameData?: EmojiGuesserData;
  onStart: () => void;
  themeConfig?: ThemeConfig | null;
}

/**
 * Welcome screen component with a modern design for the Emoji Guesser game
 */
export default function WelcomeScreen({
  gameData,
  onStart,
}: WelcomeScreenProps) {
  const { context, loading } = useFarcaster();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800">
      {/* Header with user context if available */}
      {context?.user && (
        <div className="w-full p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b border-indigo-100 dark:border-gray-700">
          <div className="max-w-5xl mx-auto flex items-center">
            {context.user.pfpUrl && (
              <Image
                src={context.user.pfpUrl}
                alt={context.user.displayName || `User ${context.user.fid}`}
                width={28}
                height={28}
                className="rounded-full mr-3 border border-indigo-200 dark:border-indigo-700"
              />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Welcome,{" "}
              {context.user.displayName ||
                context.user.username ||
                `User ${context.user.fid}`}
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl flex flex-col items-center">
          {/* Game title with prominent start button */}
          <div className="text-center mb-10 mt-4">
            <div className="mb-6 relative">
              <div className="absolute -top-6 -left-6 md:-left-10 w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-2 md:-right-6 w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full blur-xl"></div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 relative">
                {gameData?.title}
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 relative">
                {gameData?.description}
              </p>
            </div>

            {/* Prominent Start Button */}
            <button
              onClick={onStart}
              disabled={loading}
              className="px-10 py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xl hover:from-indigo-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-xl disabled:opacity-70 shine mx-auto"
            >
              {loading ? "Loading..." : "Start Playing Now"}
            </button>
          </div>

          {/* Game details in two columns */}
          <div className="mt-6 w-full grid md:grid-cols-2 gap-8">
            {/* How to Play */}
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-indigo-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center flex items-center justify-center">
                <span className="mr-2">📖</span> How To Play
              </h2>

              <div className="space-y-3">
                <div className="flex items-start bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                  <div className="shrink-0 bg-indigo-100 dark:bg-indigo-800 h-8 w-8 flex items-center justify-center rounded-full mr-3">
                    <span>1</span>
                  </div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      Decode the Emoji Clue
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Spot the hidden message in emoji combos
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-lg">
                  <div className="shrink-0 bg-cyan-100 dark:bg-cyan-800 h-8 w-8 flex items-center justify-center rounded-full mr-3">
                    <span>2</span>
                  </div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      Submit Your Answer
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Need help? Grab a hint!
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-teal-50 dark:bg-teal-900/30 p-3 rounded-lg">
                  <div className="shrink-0 bg-teal-100 dark:bg-teal-800 h-8 w-8 flex items-center justify-center rounded-full mr-3">
                    <span>3</span>
                  </div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      Score Points & Level Up
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Become an emoji master!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example section */}
            <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-indigo-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center flex items-center justify-center">
                <span className="mr-2">👀</span> Example
              </h2>

              {/* Emoji showcase */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-5 shadow-lg floating-slow">
                  <span className="text-6xl">🎮</span>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 p-5 shadow-lg floating">
                  <span className="text-6xl">🧩</span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-lg mb-5">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Here&apos;s a puzzle for you:
                    </p>
                    <div className="my-3 flex items-center justify-center gap-2">
                      <span className="text-2xl">🌞</span>
                      <span className="text-xl">+</span>
                      <span className="text-2xl">🕶️</span>
                      <span className="text-xl">=</span>
                      <span className="text-xl font-bold">?</span>
                    </div>
                    <p className="text-sm text-cyan-700 dark:text-cyan-300">
                      Answer: &quot;sunglasses&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
