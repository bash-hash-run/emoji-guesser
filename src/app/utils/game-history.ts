"use client";

import { SDK } from "@dappykit/sdk";
import { uploadToIpfs, fetchFromIpfs, IpfsRetrievalError } from "./ipfs";
import { setUserChangeNonHook, Multihash } from "@/lib/dappykit-helper";
import * as base58 from "@/lib/base58-helper";
import { cidToHex, hexToCID } from "@/lib/cid-helper";

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
 * Converts an IPFS CID to a bytes32 compatible multihash by removing the function code and size
 * @param cid - IPFS CID string (e.g., "bafkreihpdnlk3k5mqvlvcrs524df7idkullo4thmkhq6uy7vwac6c25c4i")
 * @returns An object containing hash, hashFunction and size for blockchain storage
 */
export const cidToMultihash = (cid: string): Multihash => {
  // Decode the CID using our base58 helper
  const decoded = cid.startsWith("Qm")
    ? base58.decode(cid) // Handle CIDv0 (Qm...)
    : base58.decode(cid.slice(1)); // Handle CIDv1 (b...)

  // For CIDv0, the first two bytes are the hash function (0x12) and size (0x20)
  // For CIDv1, we need to extract the actual multihash portion
  let hashBytes: Uint8Array;
  let hashFunction: number;
  let size: number;

  if (cid.startsWith("Qm")) {
    // CIDv0: Standard sha2-256 hash with multihash prefix
    hashFunction = decoded[0]; // Should be 0x12 (18 in decimal) for sha2-256
    size = decoded[1]; // Should be 0x20 (32 in decimal) for 256 bits
    hashBytes = decoded.slice(2); // Remove the multihash prefix
  } else {
    // CIDv1: Find the multihash part (more complex)
    // For simplicity in this implementation, we'll assume it's a sha2-256 hash
    // as that's the most common in IPFS
    hashFunction = 18; // 0x12 in decimal (sha2-256)
    size = 32; // 0x20 in decimal (256 bits)

    // In a proper implementation, we would parse the CID format more carefully
    // We're extracting the actual hash bytes from the CID
    // This is a simplified approach and may need adjustment for different CID formats
    hashBytes = decoded.slice(-32); // Take the last 32 bytes as the hash
  }

  // Convert to hex string with 0x prefix
  const hashHex = "0x" + Buffer.from(hashBytes).toString("hex");

  return {
    hash: hashHex as `0x${string}`,
    hashFunction,
    size,
  };
};

/**
 * Converts a multihash object back to an IPFS CID
 * @param multihash - Multihash object containing hash, hashFunction and size
 * @returns IPFS CID string
 */
export const multihashToCid = (multihash: {
  hash: string;
  hashFunction: number;
  size: number;
}): string => {
  // Remove 0x prefix if present
  const hashHex = multihash.hash.startsWith("0x")
    ? multihash.hash.slice(2)
    : multihash.hash;

  // Create buffer for the full multihash (prefix + digest)
  const buffer = Buffer.alloc(2 + hashHex.length / 2);

  // Set the hash function and size bytes
  buffer[0] = multihash.hashFunction;
  buffer[1] = multihash.size;

  // Add the hash digest
  Buffer.from(hashHex, "hex").copy(buffer, 2);

  // Encode to base58 using our helper
  return base58.encode(new Uint8Array(buffer));
};

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
      const { cid } = await uploadToIpfs(history);

      // Convert CID to lowercase hex digest using our new cid-helper
      const hexDigest = cidToHex(cid).toLowerCase();

      // Create a multihash object that stores the hex digest directly
      const multihash: Multihash = {
        hash: `0x${hexDigest}` as `0x${string}`,
        hashFunction: 18, // SHA-256 (0x12)
        size: 32, // 32 bytes (0x20)
      };

      // Store the multihash to DappyKit using our helper
      await setUserChangeNonHook(
        sdk.filesystemChanges.config.filesystemChangesAddress as `0x${string}`,
        multihash,
      );

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
      const multihash: Multihash = {
        hash: ("0x" +
          Array.from(data)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")) as `0x${string}`,
        hashFunction: 1, // Example hash function ID
        size: data.length,
      };

      // Store the multihash to DappyKit using our new helper
      await setUserChangeNonHook(
        sdk.filesystemChanges.config.filesystemChangesAddress as `0x${string}`,
        multihash,
      );
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

    // Handle the case where the multihash contains a hex digest directly (new format)
    if (multihash.hashFunction === 18 && multihash.size === 32) {
      // Remove 0x prefix if present
      const hexDigest = multihash.hash.startsWith("0x")
        ? multihash.hash.slice(2).toUpperCase()
        : multihash.hash.toUpperCase();

      // Convert the hex digest back to CID
      const cid = hexToCID(hexDigest);

      try {
        // Try to fetch from IPFS using our fetchFromIpfs utility
        const ipfsData = await fetchFromIpfs<GameHistory>(cid);
        return ipfsData;
      } catch (error) {
        console.warn(
          "Failed to retrieve from IPFS, falling back to direct decoding:",
          error,
        );
        throw new IpfsRetrievalError("Failed to retrieve from IPFS");
      }
    }

    // Legacy format compatibility - use the old conversion method
    if (multihash.hashFunction === 18) {
      // Convert multihash to CID using the old method
      const cid = multihashToCid(multihash);

      try {
        // Try to fetch from IPFS using our fetchFromIpfs utility
        const ipfsData = await fetchFromIpfs<GameHistory>(cid);
        return ipfsData;
      } catch (error) {
        console.warn(
          "Failed to retrieve from IPFS, falling back to direct decoding:",
          error,
        );
        throw new IpfsRetrievalError("Failed to retrieve from IPFS");
      }
    }

    // Handle direct encoded data (fallback)
    if (multihash.hash.length > 2) {
      try {
        // Remove 0x prefix
        const hexString = multihash.hash.startsWith("0x")
          ? multihash.hash.slice(2)
          : multihash.hash;

        // Convert hex to bytes
        const bytes = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
        }

        // Decode to string and parse
        const decoder = new TextDecoder();
        const jsonStr = decoder.decode(bytes);
        const data = JSON.parse(jsonStr) as GameHistory;
        return data;
      } catch (error) {
        console.error("Failed to decode multihash data:", error);
        throw new IpfsRetrievalError("Failed to decode history data");
      }
    }

    throw new IpfsRetrievalError("Unsupported multihash format");
  } catch (error) {
    if (
      error instanceof NoMultihashError ||
      error instanceof IpfsRetrievalError
    ) {
      throw error;
    }
    console.error("Error retrieving game history:", error);
    throw new IpfsRetrievalError(
      error instanceof Error ? error.message : "Unknown error",
    );
  }
};
