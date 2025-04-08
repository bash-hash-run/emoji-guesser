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

// Import our custom CID helper instead of multiformats
import { cidToHex, hexToCID } from "../src/lib/cid-helper";

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
    const hexDigest = cidToHex(testCID);

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
    const generatedCID = hexToCID(expectedHexDigest);

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
