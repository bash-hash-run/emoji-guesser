/**
 * CID Conversion Test Script
 * 
 * This script:
 * 1. Takes a CID in base32 format
 * 2. Decodes it to extract the SHA-256 digest
 * 3. Converts the digest to a hex string
 * 4. Compares the result with expected value
 * 
 * Run with: npm run test:cid
 */

import { CID } from 'multiformats/cid'
import { base16 } from 'multiformats/bases/base16'

/**
 * Extracts the digest from a CID and converts it to a hex string
 * @param cidString - The CID string to convert
 * @returns The hex digest without 0x prefix
 */
function extractDigestFromCID(cidString: string): string {
  // Parse the CID string
  const cid = CID.parse(cidString)
  
  // Get the multihash digest bytes
  const bytes = cid.multihash.digest
  
  // Convert bytes to uppercase hex string
  return base16.encode(bytes).slice(1).toUpperCase() // Remove the 'f' prefix from base16 encoding
}

/**
 * Main test function
 */
async function runTest(): Promise<void> {
  console.log('Starting CID conversion test...')
  
  // The CID to test - this is the complete CID from the user
  const testCID = 'bafkreihi4lerppiospxyaowqhsw5gikcx45ycgpunn52kz7jz4qdw2g2ty'
  
  // Expected output (from the image)
  const expectedHexDigest = 'E8E2C917BD0E93EF803AD03CADD32142BF3B8119F46B7BA567E9CF203B68DA9E'
  
  try {
    // Extract the digest and convert to hex
    const hexDigest = extractDigestFromCID(testCID)
    
    console.log(`Input CID: ${testCID}`)
    console.log(`Extracted digest (hex): ${hexDigest}`)
    console.log(`Expected digest (hex): ${expectedHexDigest}`)
    
    // Compare the result with expected value
    if (hexDigest === expectedHexDigest) {
      console.log('✅ TEST PASSED: Digest matches expected value!')
    } else {
      console.error('❌ TEST FAILED: Digest does not match expected value!')
      console.error(`Difference: Expected ${expectedHexDigest}, got ${hexDigest}`)
    }
  } catch (error) {
    console.error('Error during CID conversion:', error)
    process.exit(1)
  }
}

// Run the test
runTest()
  .then(() => console.log('Test completed.'))
  .catch((error) => {
    console.error('Test failed with error:', error)
    process.exit(1)
  }) 