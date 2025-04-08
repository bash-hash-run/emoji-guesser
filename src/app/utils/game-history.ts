"use client";

import { SDK } from "@dappykit/sdk";
import { uploadToIpfs, fetchFromIpfs, IpfsRetrievalError } from "./ipfs";

// Re-export the IpfsRetrievalError from ipfs.ts
export { IpfsRetrievalError } from "./ipfs";

interface GameResult {
  timestamp: number;
  score: number;
  totalAttempts: number;
  attemptsUsed: number;
  gameId?: string;
  title?: string;
}

interface GameHistory {
  plays: GameResult[];
  lastUpdated: number;
}

// Define specific error classes for better error handling
export class NoSdkError extends Error {
  constructor() {
    super("DappyKit SDK not initialized");
    this.name = "NoSdkError";
  }
}

export class NoMultihashError extends Error {
  constructor() {
    super("No previous plays found for this account");
    this.name = "NoMultihashError";
  }
}

/**
 * Saves the game result to DappyKit
 * @param sdk - DappyKit SDK instance
 * @param address - The user's address
 * @param gameResult - The game result to save
 * @returns A boolean indicating if the save was successful
 */
export const saveGameResult = async (
  sdk: SDK | null,
  address: string,
  gameResult: GameResult,
): Promise<boolean> => {
  if (!sdk) {
    throw new NoSdkError();
  }

  try {
    // First try to get existing history
    let history: GameHistory;
    try {
      const existingHistory = await getGameHistory(sdk, address);
      history = existingHistory || { plays: [], lastUpdated: Date.now() };
    } catch (error) {
      // If error is NoMultihashError, create a new history
      // Otherwise, rethrow
      if (error instanceof NoMultihashError) {
        history = { plays: [], lastUpdated: Date.now() };
      } else {
        throw error;
      }
    }

    // Add the new game result
    history.plays.push({
      ...gameResult,
      timestamp: Date.now(),
    });
    history.lastUpdated = Date.now();

    try {
      // Upload data to IPFS and get CID
      const { cid, size } = await uploadToIpfs(history);

      // Create a multihash object using the IPFS CID
      const multihash = {
        hash: `0x${cid}`, // Add 0x prefix for blockchain storage
        hashFunction: 1, // 1 is for SHA-256 (most common in IPFS)
        size: size,
      };

      // Store the multihash to DappyKit
      await sdk.filesystemChanges.setUserChange(multihash);

      return true;
    } catch (error) {
      // Fallback method if IPFS upload fails
      console.warn(
        "IPFS upload failed, using fallback encoding method:",
        error,
      );

      // Create a text encoder for direct encoding
      const historyStr = JSON.stringify(history);
      const encoder = new TextEncoder();
      // Encode the JSON string to a Uint8Array
      const data = encoder.encode(historyStr);

      // Create a multihash object (simplified for example)
      const multihash = {
        hash:
          "0x" +
          Array.from(data)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""),
        hashFunction: 1, // Example hash function ID
        size: data.length,
      };

      // Store the multihash to DappyKit
      await sdk.filesystemChanges.setUserChange(multihash);
      return true;
    }
  } catch (error) {
    console.error("Error saving game result:", error);
    throw error;
  }
};

/**
 * Gets the user's game history from DappyKit
 * @param sdk - DappyKit SDK instance
 * @param address - The user's address
 * @returns The user's game history
 * @throws {NoSdkError} If SDK is not initialized
 * @throws {NoMultihashError} If no multihash is found for the user
 * @throws {IpfsRetrievalError} If data cannot be retrieved from IPFS
 */
export const getGameHistory = async (
  sdk: SDK | null,
  address: string,
): Promise<GameHistory> => {
  if (!sdk) {
    throw new NoSdkError();
  }

  try {
    // Get the multihash from DappyKit
    const multihash =
      await sdk.filesystemChanges.getUserChangeMultihash(address);
    console.log("multihash", multihash);

    // Check if multihash is missing, empty, or a zero hash
    if (
      !multihash ||
      !multihash.hash ||
      multihash.size === 0 ||
      /^0x0*$/.test(multihash.hash) // Check if hash is all zeros
    ) {
      throw new NoMultihashError();
    }

    // Convert the hash to a string that can be used with IPFS
    const hashStr = multihash.hash.startsWith("0x")
      ? multihash.hash.slice(2)
      : multihash.hash;

    try {
      // First, try to get data from IPFS if it looks like an IPFS hash
      if (
        multihash.hashFunction === 1 &&
        multihash.size > 0 &&
        hashStr.length < 100
      ) {
        try {
          // Try to fetch from IPFS using our fetchFromIpfs utility
          const ipfsData = await fetchFromIpfs<GameHistory>(hashStr);
          return ipfsData;
        } catch (error) {
          console.warn(
            "Failed to retrieve from IPFS, falling back to direct decoding:",
            error,
          );
          // Continue to fallback method below
        }
      }

      // Fallback: Decode the hash directly if it's encoded data rather than an IPFS CID
      const bytes = new Uint8Array(hashStr.length / 2);
      for (let i = 0; i < hashStr.length; i += 2) {
        bytes[i / 2] = parseInt(hashStr.substring(i, i + 2), 16);
      }

      // Convert bytes to string
      const decoder = new TextDecoder();
      const jsonStr = decoder.decode(bytes);

      // Parse the JSON string
      const history = JSON.parse(jsonStr) as GameHistory;

      return history;
    } catch (error) {
      console.error("Error parsing multihash data:", error);
      throw new IpfsRetrievalError(
        error instanceof Error ? error.message : "Unknown parsing error",
      );
    }
  } catch (error) {
    // If it's already one of our custom errors, just rethrow
    if (
      error instanceof NoMultihashError ||
      error instanceof IpfsRetrievalError
    ) {
      throw error;
    }

    console.error("Error getting game history:", error);
    throw new IpfsRetrievalError(
      error instanceof Error ? error.message : "Unknown error",
    );
  }
};
