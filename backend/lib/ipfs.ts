/**
 * IPFS utility functions for server-side Pinata operations
 */

// Error classes for IPFS operations
class IpfsRetrievalError extends Error {
  constructor(message: string) {
    super(`Failed to retrieve data from IPFS: ${message}`);
    this.name = "IpfsRetrievalError";
  }
}

class IpfsUploadError extends Error {
  constructor(message: string) {
    super(`Failed to upload data to IPFS: ${message}`);
    this.name = "IpfsUploadError";
  }
}

class PinataCredentialsError extends Error {
  constructor() {
    super(
      "Pinata credentials are required. Please provide either JWT token or API key and secret.",
    );
    this.name = "PinataCredentialsError";
  }
}

/**
 * Uploads data to IPFS using Pinata (server-side implementation)
 * @param data - JSON data to upload
 * @returns CID hash and size of the uploaded content
 * @throws {IpfsUploadError} If upload fails
 * @throws {PinataCredentialsError} If Pinata credentials are missing
 */
export const uploadToIpfs = async (
  data: unknown,
): Promise<{ cid: string; size: number }> => {
  try {
    const apiKey = process.env.PINATA_API_KEY;
    const apiSecret = process.env.PINATA_API_SECRET;
    const jwtToken = process.env.PINATA_JWT;

    // Check if credentials are available
    if (!((apiKey && apiSecret) || jwtToken)) {
      throw new PinataCredentialsError();
    }

    // Convert data to JSON string if it's not already a string
    const jsonData = typeof data === "string" ? data : JSON.stringify(data);

    // Create a unique name for the file based on timestamp
    const fileName = `emoji-guesser-data-${Date.now()}.json`;

    // Create headers for authentication
    const headers: HeadersInit = {};

    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    } else if (apiKey && apiSecret) {
      headers["pinata_api_key"] = apiKey;
      headers["pinata_secret_api_key"] = apiSecret;
    }

    // Set Content-Type header
    headers["Content-Type"] = "application/json";

    // Create pinata metadata
    const pinataMetadata = {
      name: fileName,
      keyvalues: {
        app: "emoji-guesser",
        timestamp: Date.now().toString(),
      },
    };

    // Set pinata options
    const pinataOptions = {
      cidVersion: 1,
    };

    // Create request body
    const requestBody = {
      pinataContent: data,
      pinataMetadata,
      pinataOptions,
    };

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Calculate size of the data
    const size = Buffer.byteLength(jsonData, "utf8");

    return {
      cid: result.IpfsHash,
      size,
    };
  } catch (error) {
    console.error("Error uploading to IPFS:", error);

    if (error instanceof PinataCredentialsError) {
      throw error;
    }

    throw new IpfsUploadError(
      error instanceof Error ? error.message : "Unknown upload error",
    );
  }
};

/**
 * Fetches data from IPFS using a CID through Pinata gateway (server-side implementation)
 * @param cid - The IPFS Content Identifier
 * @returns The data fetched from IPFS
 * @throws {IpfsRetrievalError} If retrieval fails
 */
export const fetchFromIpfs = async <T>(cid: string): Promise<T> => {
  try {
    const pinataGateway = "https://gateway.pinata.cloud/ipfs/";

    // Remove 0x prefix if present
    const cleanCid = cid.startsWith("0x") ? cid.slice(2) : cid;

    const response = await fetch(`${pinataGateway}${cleanCid}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch from Pinata gateway: ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Error fetching from IPFS:", error);
    throw new IpfsRetrievalError(
      error instanceof Error ? error.message : "Unknown error",
    );
  }
};
