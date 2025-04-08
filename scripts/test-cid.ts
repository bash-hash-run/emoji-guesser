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
 * Run a single test case for CID conversion
 * @param testCID - CID to test
 * @param expectedHexDigest - Expected hex digest
 * @param testNumber - Test case number
 * @returns True if tests passed, false otherwise
 */
async function runTestCase(
  testCID: string,
  expectedHexDigest: string,
  testNumber: number,
): Promise<boolean> {
  console.log(`\n=== Test Case ${testNumber} ===`);
  let success = true;

  try {
    // Test CID to Hex conversion
    console.log(`=== Testing CID to Hex conversion ===`);
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
      success = false;
    }

    // Test Hex to CID conversion
    console.log(`\n=== Testing Hex to CID conversion ===`);
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
      success = false;
    }

    return success;
  } catch (error) {
    console.error(`Error during test case ${testNumber}:`, error);
    return false;
  }
}

/**
 * Main test function
 */
async function runTest(): Promise<void> {
  console.log("Starting CID conversion tests...");

  // Define test cases
  const testCases = [
    {
      cid: "bafkreihi4lerppiospxyaowqhsw5gikcx45ycgpunn52kz7jz4qdw2g2ty",
      hex: "E8E2C917BD0E93EF803AD03CADD32142BF3B8119F46B7BA567E9CF203B68DA9E",
      description: "Original test case",
    },
    {
      cid: "bafkreidxsjc7anyqhq3wfuynwj4vlkdktdeztsitk6ethtxkbbdcqids4u",
      hex: "779245F037103C3762D30DB27955A86A98C999C913578933CEEA0846282072E5",
      description: "Additional test case",
    },
  ];

  try {
    let allTestsPassed = true;

    // Run each test case
    for (let i = 0; i < testCases.length; i++) {
      const { cid, hex, description } = testCases[i];
      console.log(`\nRunning test case ${i + 1}: ${description}`);

      const testPassed = await runTestCase(cid, hex, i + 1);
      if (!testPassed) {
        allTestsPassed = false;
      }
    }

    // Final summary
    console.log("\n=== Test Summary ===");
    if (allTestsPassed) {
      console.log("✅ ALL TESTS PASSED!");
    } else {
      console.error("❌ SOME TESTS FAILED!");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error during tests:", error);
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
