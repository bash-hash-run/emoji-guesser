import { useState } from "react";
import { EmojiGuesserData, GameState, ThemeConfig } from "../types";
import WelcomeScreen from "./WelcomeScreen";
import GuessScreen from "./GuessScreen";
import ResultsScreen from "./ResultsScreen";

interface EmojiGuesserProps {
  gameData: EmojiGuesserData;
  themeConfig: ThemeConfig | null;
}

/**
 * Main EmojiGuesser component that manages game state and flow
 */
export default function EmojiGuesser({
  gameData,
  themeConfig,
}: EmojiGuesserProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentGuessIndex: 0,
    score: 0,
    attemptsRemaining: gameData.attempts_per_game,
    usedHints: Array(gameData.guesses.length).fill(false),
    answers: Array(gameData.guesses.length).fill(""),
    isCompleted: false,
    gameResult: null,
  });

  const [showWelcome, setShowWelcome] = useState(true);

  // Reset game state
  const handleRestart = () => {
    setGameState({
      currentGuessIndex: 0,
      score: 0,
      attemptsRemaining: gameData.attempts_per_game,
      usedHints: Array(gameData.guesses.length).fill(false),
      answers: Array(gameData.guesses.length).fill(""),
      isCompleted: false,
      gameResult: null,
    });
    setShowWelcome(true);
  };

  // Start the game
  const handleStart = () => {
    setShowWelcome(false);
  };

  // Process answer and move to next guess or finish game
  const handleAnswer = (answer: string) => {
    const currentGuess = gameData.guesses[gameState.currentGuessIndex];
    const isCorrect =
      answer.toLowerCase().trim() === currentGuess.answer.toLowerCase();

    const newAnswers = [...gameState.answers];
    newAnswers[gameState.currentGuessIndex] = answer.toLowerCase().trim();

    // Update attempts remaining if answer is wrong
    const newAttemptsRemaining = isCorrect
      ? gameState.attemptsRemaining
      : gameState.attemptsRemaining - 1;

    const newState = {
      ...gameState,
      score: isCorrect ? gameState.score + 1 : gameState.score,
      answers: newAnswers,
      attemptsRemaining: newAttemptsRemaining,
    };

    // Check if game should end
    if (newAttemptsRemaining <= 0) {
      setGameState({
        ...newState,
        isCompleted: true,
        gameResult: "failure",
      });
      return;
    }

    // Check if this was the last guess
    if (gameState.currentGuessIndex === gameData.guesses.length - 1) {
      setGameState({
        ...newState,
        isCompleted: true,
        gameResult: "success",
      });
    } else {
      // Move to next guess if answer is correct
      if (isCorrect) {
        setGameState({
          ...newState,
          currentGuessIndex: gameState.currentGuessIndex + 1,
        });
      } else {
        // Stay on the same guess but update attempts
        setGameState(newState);
      }
    }
  };

  // Handle hint usage
  const handleUseHint = () => {
    const newUsedHints = [...gameState.usedHints];
    newUsedHints[gameState.currentGuessIndex] = true;

    setGameState({
      ...gameState,
      usedHints: newUsedHints,
    });
  };

  // Handle adding more attempts with purchase
  const handleAddAttempts = () => {
    setGameState({
      ...gameState,
      attemptsRemaining: gameState.attemptsRemaining + 10,
    });
  };

  /**
   * Handle exiting the game and returning to welcome screen
   */
  const handleExitGame = () => {
    setShowWelcome(true);
  };

  // Render the appropriate screen based on game state
  if (showWelcome) {
    return (
      <WelcomeScreen
        gameData={gameData}
        onStart={handleStart}
        themeConfig={themeConfig}
      />
    );
  }

  if (gameState.isCompleted) {
    return (
      <ResultsScreen
        gameData={gameData}
        gameState={gameState}
        onRestart={handleRestart}
        onAddAttempts={handleAddAttempts}
        themeConfig={themeConfig}
      />
    );
  }

  return (
    <GuessScreen
      gameData={gameData}
      gameState={gameState}
      onAnswer={handleAnswer}
      onUseHint={handleUseHint}
      onAddAttempts={handleAddAttempts}
      onExitGame={handleExitGame}
      themeConfig={themeConfig}
    />
  );
}
