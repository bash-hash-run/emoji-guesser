/**
 * CID Conversion Test Script
 *
 * This script:
 * 1. Takes a CID in base32 format
 * 2. Decodes it to extract the SHA-256 digest
 * 3. Converts the digest to a hex string
 * 4. Converts the hex digest back to a CID
 * 5. Compares the results with expected values
 *
 * Run with: npm run test:cid
 */

import { CID } from "multiformats/cid";
import { base16 } from "multiformats/bases/base16";
import { base32 } from "multiformats/bases/base32";
import * as raw from "multiformats/codecs/raw";
import { sha256 } from "multiformats/hashes/sha2";
import { create } from "multiformats/hashes/digest";

/**
 * Extracts the digest from a CID and converts it to a hex string
 * @param cidString - The CID string to convert
 * @returns The hex digest without 0x prefix
 */
function extractDigestFromCID(cidString: string): string {
  // Parse the CID string
  const cid = CID.parse(cidString);

  // Get the multihash digest bytes
  const bytes = cid.multihash.digest;

  // Convert bytes to uppercase hex string
  return base16.encode(bytes).slice(1).toUpperCase(); // Remove the 'f' prefix from base16 encoding
}

/**
 * Converts a hex digest to a CID string in base32 format
 * @param hexDigest - The hex digest string to convert (without 0x prefix)
 * @returns The CID string in base32 format
 */
function convertHexToCID(hexDigest: string): string {
  // Normalize hex string to lowercase
  const normalizedHex = hexDigest.toLowerCase();

  // Convert hex string to bytes
  const digestBytes = base16.decode(`f${normalizedHex}`); // Add 'f' prefix for base16 decoding

  // Create a multihash digest object directly from the digest bytes
  const digest = create(sha256.code, digestBytes);

  // Create a CID from the multihash digest
  const cid = CID.create(1, raw.code, digest);

  // Return the CID as a base32 string
  return cid.toString();
}

/**
 * Main test function
 */
async function runTest(): Promise<void> {
  console.log("Starting CID conversion tests...");

  // The CID to test - this is the complete CID from the user
  const testCID = "bafkreihi4lerppiospxyaowqhsw5gikcx45ycgpunn52kz7jz4qdw2g2ty";

  // Expected output (from the image)
  const expectedHexDigest =
    "E8E2C917BD0E93EF803AD03CADD32142BF3B8119F46B7BA567E9CF203B68DA9E";

  try {
    // Test 1: CID to Hex conversion
    console.log("\n=== Testing CID to Hex conversion ===");
    const hexDigest = extractDigestFromCID(testCID);

    console.log(`Input CID: ${testCID}`);
    console.log(`Extracted digest (hex): ${hexDigest}`);
    console.log(`Expected digest (hex): ${expectedHexDigest}`);

    // Compare the result with expected value
    if (hexDigest === expectedHexDigest) {
      console.log("✅ TEST PASSED: Digest matches expected value!");
    } else {
      console.error("❌ TEST FAILED: Digest does not match expected value!");
      console.error(
        `Difference: Expected ${expectedHexDigest}, got ${hexDigest}`,
      );
    }

    // Test 2: Hex to CID conversion
    console.log("\n=== Testing Hex to CID conversion ===");
    const generatedCID = convertHexToCID(expectedHexDigest);

    console.log(`Input hex digest: ${expectedHexDigest}`);
    console.log(`Generated CID: ${generatedCID}`);
    console.log(`Expected CID: ${testCID}`);

    // Compare the result with expected value
    if (generatedCID === testCID) {
      console.log("✅ TEST PASSED: Generated CID matches expected value!");
    } else {
      console.error(
        "❌ TEST FAILED: Generated CID does not match expected value!",
      );
      console.error(`Difference: Expected ${testCID}, got ${generatedCID}`);
    }
  } catch (error) {
    console.error("Error during CID conversion:", error);
    process.exit(1);
  }
}

// Run the test
runTest()
  .then(() => console.log("Tests completed."))
  .catch((error) => {
    console.error("Tests failed with error:", error);
    process.exit(1);
  });
