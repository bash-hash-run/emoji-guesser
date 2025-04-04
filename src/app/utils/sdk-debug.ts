/**
 * Utility functions for debugging the Farcaster SDK
 */

/**
 * Log an SDK event with additional data for debugging
 * @param eventName - Name of the event to log
 * @param data - Additional data to log with the event (optional)
 */
export function logSDKEvent(eventName: string, data?: unknown): void {
  console.log(`[Farcaster SDK] ${eventName}`, data || "");
}

/**
 * Check if we're in a Farcaster environment
 * @returns Boolean indicating if we're in a Farcaster client
 */
export function isFarcasterEnvironment(): boolean {
  // Check for window and add additional checks if needed to determine
  // if we're running inside a Farcaster client
  if (typeof window !== "undefined") {
    // Check for Farcaster-specific properties
    // This is a simplified check and should be expanded based on actual SDK documentation
    const hasFarcasterProps = Boolean(
      window.parent !== window && window.parent.postMessage,
    );

    return hasFarcasterProps;
  }

  return false;
}

/**
 * Get debug information about the SDK state and environment
 * @returns Object with debug information
 */
export function getSDKDebugInfo(): Record<string, unknown> {
  const info: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "Not available",
    url: typeof window !== "undefined" ? window.location.href : "Not available",
    isFarcaster: isFarcasterEnvironment(),
  };

  return info;
}
