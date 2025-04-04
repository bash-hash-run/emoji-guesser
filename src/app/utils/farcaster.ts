/**
 * Utility functions for Farcaster integration
 */

/**
 * Generate a Farcaster intent URL to compose a cast with game results
 * @param text - Text to include in the cast
 * @param appUrl - URL to embed in the cast (the game app)
 * @returns URL string for the intent
 */
export function generateShareIntent(text: string, appUrl: string): string {
  // Encode the text and URL parameters properly
  const encodedText = encodeURIComponent(text);
  const encodedEmbed = encodeURIComponent(appUrl);

  // Use a simpler URL format that avoids array parameter issues
  return `https://warpcast.com/~/compose?text=${encodedText}&embed=${encodedEmbed}`;
}

/**
 * Create a shareable text for game results
 * @param gameName - Name of the game
 * @param score - User's score
 * @param totalQuestions - Total number of questions
 * @returns Formatted share text
 */
export function createShareText(
  gameName: string,
  score: number,
  totalQuestions: number,
): string {
  const percentage = Math.round((score / totalQuestions) * 100);
  let emoji = "";

  // Select emoji based on score percentage
  if (percentage >= 90) emoji = "🏆";
  else if (percentage >= 70) emoji = "🎉";
  else if (percentage >= 50) emoji = "👍";
  else emoji = "🔄";

  // Format the share text
  return `${emoji} I scored ${percentage}% (${score}/${totalQuestions}) on the "${gameName}" game! Try it yourself:`;
}

/**
 * Get the current app URL
 * @returns The app's full URL
 */
export function getAppUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://web4-emoji-guesser.vercel.app";

  // Return the base URL - in a more complex app you might want to include
  // specific parameters to track shares or target specific game IDs
  return baseUrl;
}
