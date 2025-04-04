"use client";

import { useState, useEffect } from "react";
import EmojiGuesser from "./components/EmojiGuesser";
import { EmojiGuesserData, ThemeConfig } from "./types";
import { loadConfig } from "./utils";
import { useFarcaster } from "./components/FarcasterProvider";
import { logSDKEvent } from "./utils/sdk-debug";

/**
 * Main page component that loads emoji guesser data and renders the EmojiGuesser component
 */
export default function Home() {
  const { sdk } = useFarcaster();
  const [gameData, setGameData] = useState<EmojiGuesserData | null>(null);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        logSDKEvent("Fetching game data");
        // Load both game data and theme config in parallel
        const [gameResponse, config] = await Promise.all([
          fetch("/data.json"),
          loadConfig(),
        ]);

        if (!gameResponse.ok) {
          throw new Error(`Failed to fetch data: ${gameResponse.statusText}`);
        }

        const data = await gameResponse.json();
        setGameData(data);
        setThemeConfig(config);
        logSDKEvent("Game data loaded successfully");
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        logSDKEvent("Error loading game data", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Call ready() when content is loaded
  useEffect(() => {
    // Only call ready() when data is loaded and we're not in an error state
    if (!loading && !error && gameData && sdk?.actions?.ready) {
      logSDKEvent("Page content loaded, calling sdk.actions.ready()");
      // Call ready to indicate the UI is fully loaded and ready to display
      sdk.actions.ready().catch((err) => {
        console.error(
          "Error calling sdk.actions.ready() in page component:",
          err,
        );
        logSDKEvent("Error calling sdk.actions.ready() in page component", err);
      });
    }
  }, [loading, error, gameData, sdk]);

  // Generate gradient class based on theme config
  const bgGradientClass = themeConfig
    ? `from-${themeConfig.theme.backgroundGradient.from} to-${themeConfig.theme.backgroundGradient.to}`
    : "from-emerald-500 to-cyan-600";

  if (loading) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br ${bgGradientClass} animate-gradient`}
      >
        <div className="w-16 h-16 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
        <p className="mt-4 text-xl font-medium text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br ${bgGradientClass} animate-gradient`}
      >
        <div
          className={`p-8 bg-${themeConfig?.theme.card.background || "white"} rounded-xl shadow-lg dark:bg-${themeConfig?.theme.card.darkBackground || "gray-800"}`}
        >
          <h2 className="mb-4 text-2xl font-bold text-red-600">Error</h2>
          <p
            className={`text-${themeConfig?.theme.text.primary || "gray-700"} dark:text-${themeConfig?.theme.text.darkPrimary || "gray-300"}`}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 mt-4 text-white bg-gradient-to-r from-${themeConfig?.theme.button.gradient.from || "emerald-500"} to-${themeConfig?.theme.button.gradient.to || "cyan-600"} rounded hover:from-${themeConfig?.theme.button.hover.from || "emerald-600"} hover:to-${themeConfig?.theme.button.hover.to || "cyan-700"}`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return null;
  }

  return <EmojiGuesser gameData={gameData} themeConfig={themeConfig} />;
}
