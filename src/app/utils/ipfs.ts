"use client";

/**
 * IPFS utility functions for storing and retrieving data using backend API
 */

// Error classes for IPFS operations
export class IpfsRetrievalError extends Error {
  constructor(message: string) {
    super(`Failed to retrieve data from IPFS: ${message}`);
    this.name = "IpfsRetrievalError";
  }
}

export class IpfsUploadError extends Error {
  constructor(message: string) {
    super(`Failed to upload data to IPFS: ${message}`);
    this.name = "IpfsUploadError";
  }
}

/**
 * Uploads data to IPFS using the backend API
 * @param data - JSON data to upload
 * @returns CID hash and size of the uploaded content
 * @throws {IpfsUploadError} If upload fails
 */
export const uploadToIpfs = async (
  data: unknown,
): Promise<{ cid: string; size: number }> => {
  try {
    // Convert data to JSON string if it's not already a string
    const jsonData = typeof data === "string" ? data : JSON.stringify(data);

    const response = await fetch("/api/ipfs/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Upload failed: ${response.statusText}`,
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Upload failed");
    }

    return {
      cid: result.cid,
      size: result.size,
    };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new IpfsUploadError(
      error instanceof Error ? error.message : "Unknown upload error",
    );
  }
};

/**
 * Fetches data from IPFS using a CID through the backend API
 * @param cid - The IPFS Content Identifier
 * @returns The data fetched from IPFS
 * @throws {IpfsRetrievalError} If retrieval fails
 */
export const fetchFromIpfs = async <T>(cid: string): Promise<T> => {
  try {
    // Remove 0x prefix if present
    const cleanCid = cid.startsWith("0x") ? cid.slice(2) : cid;

    const response = await fetch(`/api/ipfs/fetch/${cleanCid}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Fetch failed: ${response.statusText}`,
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Fetch failed");
    }

    return result.data as T;
  } catch (error) {
    console.error("Error fetching from IPFS:", error);
    throw new IpfsRetrievalError(
      error instanceof Error ? error.message : "Unknown error",
    );
  }
};

/**
 * Formats a multihash object into a string format for display or use with IPFS gateways
 * @param multihash - The multihash object from DappyKit
 * @returns A formatted multihash string
 */
export const formatMultihash = (multihash: {
  hash: string;
  hashFunction: number;
  size: number;
}): string => {
  // Basic conversion - in a real app, you might want to use a proper multihash library
  return multihash.hash.startsWith("0x")
    ? multihash.hash.slice(2) // Remove '0x' prefix if present
    : multihash.hash;
};
