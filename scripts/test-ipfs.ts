/**
 * IPFS Test Script
 *
 * This script:
 * 1. Uploads random data to IPFS via Pinata
 * 2. Retrieves the data using the returned CID
 * 3. Verifies the retrieved data matches the original
 *
 * Run with: npm run test:ipfs
 */

import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";

// Define error classes for IPFS operations
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

// Interface definitions
interface IpfsUploadResult {
  cid: string;
  size: number;
}

interface Multihash {
  hash: string;
  hashFunction: number;
  size: number;
}

interface TestData {
  id: string;
  timestamp: number;
  randomValue: number;
  text: string;
  nestedData: {
    array: number[];
    object: {
      key1: string;
      key2: number;
    };
  };
}

/**
 * Uploads data to IPFS using Pinata
 * @param data - JSON data to upload
 * @returns CID hash and size of the uploaded content
 * @throws {IpfsUploadError} If upload fails
 */
async function uploadToIpfs(data: unknown): Promise<IpfsUploadResult> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
    const jwtToken = process.env.NEXT_PUBLIC_PINATA_JWT;

    // Get values from .env.local if not already in environment
    if (!apiKey && !apiSecret && !jwtToken) {
      try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        const envContent = fs.readFileSync(envPath, "utf8");

        const jwtMatch = envContent.match(/NEXT_PUBLIC_PINATA_JWT=(.+)/);
        const apiKeyMatch = envContent.match(/NEXT_PUBLIC_PINATA_API_KEY=(.+)/);
        const apiSecretMatch = envContent.match(
          /NEXT_PUBLIC_PINATA_API_SECRET=(.+)/,
        );

        if (jwtMatch && jwtMatch[1]) {
          process.env.NEXT_PUBLIC_PINATA_JWT = jwtMatch[1]
            .trim()
            .replace(/^['"]|['"]$/g, "");
        }
        if (apiKeyMatch && apiKeyMatch[1]) {
          process.env.NEXT_PUBLIC_PINATA_API_KEY = apiKeyMatch[1]
            .trim()
            .replace(/^['"]|['"]$/g, "");
        }
        if (apiSecretMatch && apiSecretMatch[1]) {
          process.env.NEXT_PUBLIC_PINATA_API_SECRET = apiSecretMatch[1]
            .trim()
            .replace(/^['"]|['"]$/g, "");
        }
      } catch (error) {
        console.warn(
          "Could not load environment variables from .env.local",
          error,
        );
      }
    }

    // Convert data to JSON string if it's not already a string
    const jsonData = typeof data === "string" ? data : JSON.stringify(data);

    // Use curl command for uploading since FormData doesn't work well in Node.js without additional libraries
    // This approach is different from the browser implementation because Node.js doesn't have the same FormData API
    let curlCommand: string;
    const tmpFilePath = path.resolve(
      process.cwd(),
      `tmp-upload-${Date.now()}.json`,
    );

    // Write data to temporary file
    fs.writeFileSync(tmpFilePath, jsonData);

    try {
      const jwtToken = process.env.NEXT_PUBLIC_PINATA_JWT;
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

      if (jwtToken) {
        curlCommand = `curl -X POST "https://api.pinata.cloud/pinning/pinFileToIPFS" -H "Authorization: Bearer ${jwtToken}" -F "file=@${tmpFilePath}" -F "pinataMetadata={\\"name\\":\\"emoji-guesser-data-${Date.now()}.json\\",\\"keyvalues\\":{\\"app\\":\\"emoji-guesser\\",\\"timestamp\\":\\"${Date.now()}\\"}}" -F "pinataOptions={\\"cidVersion\\":1}"`;
      } else if (apiKey && apiSecret) {
        curlCommand = `curl -X POST "https://api.pinata.cloud/pinning/pinFileToIPFS" -H "pinata_api_key: ${apiKey}" -H "pinata_secret_api_key: ${apiSecret}" -F "file=@${tmpFilePath}" -F "pinataMetadata={\\"name\\":\\"emoji-guesser-data-${Date.now()}.json\\",\\"keyvalues\\":{\\"app\\":\\"emoji-guesser\\",\\"timestamp\\":\\"${Date.now()}\\"}}" -F "pinataOptions={\\"cidVersion\\":1}"`;
      } else {
        throw new Error("No Pinata API keys found");
      }

      const result = JSON.parse(execSync(curlCommand).toString());

      return {
        cid: result.IpfsHash,
        size: Buffer.byteLength(jsonData),
      };
    } finally {
      // Clean up temp file
      if (fs.existsSync(tmpFilePath)) {
        fs.unlinkSync(tmpFilePath);
      }
    }
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new IpfsUploadError(
      error instanceof Error ? error.message : "Unknown upload error",
    );
  }
}

/**
 * Fetches data from IPFS using a CID
 * @param cid - The IPFS Content Identifier
 * @returns The data fetched from IPFS
 * @throws {IpfsRetrievalError} If retrieval fails
 */
async function fetchFromIpfs<T>(cid: string): Promise<T> {
  try {
    // List of public IPFS gateways to try
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
    const https = require("https");

    for (const gateway of ipfsGateways) {
      try {
        const url = `${gateway}${cleanCid}`;
        const result = await new Promise<T>((resolve, reject) => {
          https
            .get(url, (res: any) => {
              if (res.statusCode !== 200) {
                reject(new Error(`Status code: ${res.statusCode}`));
                return;
              }

              let rawData = "";
              res.on("data", (chunk: Buffer) => {
                rawData += chunk;
              });
              res.on("end", () => {
                try {
                  const parsedData = JSON.parse(rawData);
                  resolve(parsedData as T);
                } catch (e) {
                  reject(e);
                }
              });
            })
            .on("error", reject);
        });

        return result;
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
}

/**
 * Formats a multihash object into a string format for display or use with IPFS gateways
 * @param multihash - The multihash object from DappyKit
 * @returns A formatted multihash string
 */
function formatMultihash(multihash: Multihash): string {
  // Basic conversion - in a real app, you might want to use a proper multihash library
  return multihash.hash.startsWith("0x")
    ? multihash.hash.slice(2) // Remove '0x' prefix if present
    : multihash.hash;
}

/**
 * Generates random test data
 * @returns Random test data object
 */
function generateRandomData(): TestData {
  return {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: Date.now(),
    randomValue: Math.floor(Math.random() * 1000),
    text: `Test data ${new Date().toISOString()}`,
    nestedData: {
      array: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
      object: {
        key1: "value1",
        key2: Math.random(),
      },
    },
  };
}

/**
 * Compares two objects for equality
 * @param obj1 First object
 * @param obj2 Second object
 * @returns True if objects are deeply equal
 */
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * Main test function
 */
async function runTest(): Promise<void> {
  console.log("🧪 Starting IPFS Pinata Test");

  try {
    // Generate random test data
    const testData = generateRandomData();
    console.log("📦 Test data generated:", testData);

    // Upload to IPFS
    console.log("⏳ Uploading to IPFS via Pinata...");
    const { cid, size } = await uploadToIpfs(testData);
    console.log("✅ Upload successful!");
    console.log(`📋 CID: ${cid}`);
    console.log(`📊 Size: ${size} bytes`);

    // Small delay to ensure propagation
    console.log("⏳ Waiting for IPFS propagation...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Fetch from IPFS
    console.log("🔍 Retrieving data from IPFS...");
    const retrievedData = await fetchFromIpfs<TestData>(cid);
    console.log("✅ Data retrieved successfully!");
    console.log("📦 Retrieved data:", retrievedData);

    // Verify data
    console.log("🔍 Verifying data integrity...");
    const isEqual = deepEqual(testData, retrievedData);

    if (isEqual) {
      console.log("✅ TEST PASSED: Data integrity verified!");
    } else {
      console.error("❌ TEST FAILED: Retrieved data does not match original");
      console.log("Original:", JSON.stringify(testData, null, 2));
      console.log("Retrieved:", JSON.stringify(retrievedData, null, 2));
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ TEST FAILED with error:", error);
    process.exit(1);
  }
}

// Run the test
runTest();
 