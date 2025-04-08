"use client";

/**
 * IPFS utility functions for storing and retrieving data using Pinata
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
 * Uploads data to IPFS using Pinata
 * @param data - JSON data to upload
 * @returns CID hash and size of the uploaded content
 * @throws {IpfsUploadError} If upload fails
 */
export const uploadToIpfs = async (
  data: unknown,
): Promise<{ cid: string; size: number }> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
    const jwtToken = process.env.NEXT_PUBLIC_PINATA_JWT;

    // Convert data to JSON string if it's not already a string
    const jsonData = typeof data === "string" ? data : JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a unique name for the file based on timestamp
    const fileName = `emoji-guesser-data-${Date.now()}.json`;

    // If we have Pinata credentials, use their API
    if ((apiKey && apiSecret) || jwtToken) {
      // Create headers for authentication
      const headers: HeadersInit = {};

      if (jwtToken) {
        headers.Authorization = `Bearer ${jwtToken}`;
      } else if (apiKey && apiSecret) {
        headers["pinata_api_key"] = apiKey;
        headers["pinata_secret_api_key"] = apiSecret;
      }

      // Create form data - DO NOT set Content-Type header when using FormData
      // The browser will automatically set it with the correct boundary
      const formData = new FormData();
      formData.append("file", blob, fileName);

      // Add metadata to identify the upload
      const pinataMetadata = JSON.stringify({
        name: fileName,
        keyvalues: {
          app: "emoji-guesser",
          timestamp: Date.now().toString(),
        },
      });
      formData.append("pinataMetadata", pinataMetadata);

      // Set pinata options
      const pinataOptions = JSON.stringify({
        cidVersion: 1,
      });
      formData.append("pinataOptions", pinataOptions);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers,
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        cid: result.IpfsHash,
        size: blob.size,
      };
    }

    // Fallback to public IPFS gateway if no API keys available
    console.warn("No Pinata API keys found, using fallback IPFS gateway");
    const formData = new FormData();
    formData.append("file", blob);

    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Infura IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      cid: result.Hash,
      size: result.Size,
    };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new IpfsUploadError(
      error instanceof Error ? error.message : "Unknown upload error",
    );
  }
};

/**
 * Fetches data from IPFS using a CID
 * @param cid - The IPFS Content Identifier
 * @returns The data fetched from IPFS
 * @throws {IpfsRetrievalError} If retrieval fails
 */
export const fetchFromIpfs = async <T>(cid: string): Promise<T> => {
  try {
    // List of public IPFS gateways to try, including Pinata's gateway
    const ipfsGateways = [
      "https://gateway.pinata.cloud/ipfs/",
      "https://ipfs.io/ipfs/",
      "https://cloudflare-ipfs.com/ipfs/",
      "https://ipfs.infura.io/ipfs/",
    ];

    // Remove 0x prefix if present
    const cleanCid = cid.startsWith("0x") ? cid.slice(2) : cid;

    // Try each gateway until one works
    let lastError: Error | null = null;

    for (const gateway of ipfsGateways) {
      try {
        const response = await fetch(`${gateway}${cleanCid}`);

        if (response.ok) {
          return (await response.json()) as T;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        // Continue to next gateway
      }
    }

    // If we get here, all gateways failed
    throw lastError || new Error("All IPFS gateways failed");
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
