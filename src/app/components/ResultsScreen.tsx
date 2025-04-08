"use client";

import React, { useState } from "react";
import { EmojiGuesserData, GameState, ThemeConfig } from "../types";
import { useFarcaster } from "./FarcasterProvider";
import { useDappyKit } from "../utils/dappykit-context";
import { saveGameResult, NoSdkError } from "../utils/game-history";
import AnswersModal from "./modals/AnswersModal";
import PurchaseAttemptsModal from "./modals/PurchaseAttemptsModal";
import { useAccount } from "wagmi";

// Import modular components
import ResultsHeader from "./results/ResultsHeader";
import ScoreCard from "./results/ScoreCard";
import { ActionButtons } from "./results/ActionButtons";

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
        // Use a hash of title and timestamp if id is not available
        gameId: gameData.title
          ? `${gameData.title}-${Date.now()}`
          : `game-${Date.now()}`,
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
        <ResultsHeader gameData={gameData} gameState={gameState} />

        {/* Share and Save buttons */}
        <div className="mb-6">
          <ActionButtons
            gameData={gameData}
            gameState={gameState}
            farcasterSdk={farcasterSdk}
            savingProgress={savingProgress}
            saveSuccess={saveSuccess}
            saveError={saveError}
            onSaveProgress={handleSaveProgress}
          />
        </div>

        {/* Score card with game statistics and action buttons */}
        <ScoreCard
          gameData={gameData}
          gameState={gameState}
          onRestart={onRestart}
          toggleAnswersModal={toggleAnswersModal}
          togglePurchaseModal={togglePurchaseModal}
        />

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
