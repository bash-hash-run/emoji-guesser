/**
 * Shuffles an array and tracks the new position of the first element
 * @param array The array to shuffle
 * @returns A tuple containing the shuffled array and the new index of what was the first element
 */
export function shuffleOptions<T>(array: T[]): [T[], number] {
  // Create a copy of the array to avoid modifying the original
  const newArray = [...array];
  const correctAnswer = newArray[0]; // First option is correct
  let correctIndex = 0;

  // Fisher-Yates shuffle algorithm
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];

    // Track the position of the correct answer
    if (newArray[i] === correctAnswer) {
      correctIndex = i;
    } else if (newArray[j] === correctAnswer) {
      correctIndex = j;
    }
  }

  return [newArray, correctIndex];
}

/**
 * Truncates an Ethereum address to display format
 * @param address - The full Ethereum address
 * @param startChars - Number of characters to show at the start (default: 6)
 * @param endChars - Number of characters to show at the end (default: 4)
 * @returns The truncated address string
 */
export function truncateEthAddress(
  address: string,
  startChars = 6,
  endChars = 4,
): string {
  if (!address) return "";

  // Make sure the address is a valid ethereum address format
  if (!address.startsWith("0x") || address.length < 10) {
    return address;
  }

  // Return the truncated address
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
}

/**
 * Loads the configuration from config.json
 * @returns Promise that resolves to the theme configuration
 */
export async function loadConfig() {
  try {
    const response = await fetch("/config.json");
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading config:", error);
    // Return default configuration as fallback
    return {
      theme: {
        backgroundGradient: {
          from: "indigo-500",
          to: "purple-600",
        },
        title: {
          gradient: {
            from: "purple-600",
            to: "indigo-500",
          },
        },
        button: {
          gradient: {
            from: "indigo-500",
            to: "purple-600",
          },
          hover: {
            from: "indigo-600",
            to: "purple-700",
          },
        },
        card: {
          background: "white",
          darkBackground: "gray-800",
        },
        text: {
          primary: "gray-700",
          secondary: "gray-600",
          darkPrimary: "gray-300",
          darkSecondary: "gray-400",
        },
      },
    };
  }
}
