/**
 * Base58 encoding/decoding helper
 * This implements the functionality of the bs58 library without the dependency
 */

// Base58 character set: Bitcoin's alphabet (excludes 0, O, I, l to avoid confusion)
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE = ALPHABET.length;

// Lookup table for character to value conversion
const ALPHABET_MAP: { [key: string]: number } = {};
for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}

/**
 * Encodes a Uint8Array into a base58 string
 * @param bytes - The bytes to encode
 * @returns Base58 encoded string
 */
export function encode(bytes: Uint8Array): string {
  if (bytes.length === 0) return "";

  // Count leading zeros
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) {
    zeros++;
  }

  // Allocate enough space for the result
  const size = ((bytes.length - zeros) * 138) / 100 + 1; // log(256) / log(58)
  const b58 = new Uint8Array(size);
  let length = 0;

  // Process the bytes
  for (let i = zeros; i < bytes.length; i++) {
    let carry = bytes[i];
    let j = 0;

    // Apply "b58 = b58 * 256 + ch"
    for (let k = b58.length - 1; k >= 0; k--, j++) {
      if (carry === 0 && j >= length) break;
      carry += 256 * b58[k];
      b58[k] = carry % BASE;
      carry = Math.floor(carry / BASE);
    }

    length = j;
  }

  // Skip leading zeroes
  let i = b58.length - length;
  while (i < b58.length && b58[i] === 0) {
    i++;
  }

  // Translate to base58 alphabet
  let result = "1".repeat(zeros);
  for (; i < b58.length; i++) {
    result += ALPHABET.charAt(b58[i]);
  }

  return result;
}

/**
 * Decodes a base58 string into a Uint8Array
 * @param str - The base58 encoded string
 * @returns Decoded bytes as Uint8Array
 */
export function decode(str: string): Uint8Array {
  if (str.length === 0) return new Uint8Array(0);

  // Count leading '1's (representing zeros)
  let zeros = 0;
  while (zeros < str.length && str[zeros] === "1") {
    zeros++;
  }

  // Allocate enough space for the result
  const size = Math.floor(((str.length - zeros) * 733) / 1000) + 1; // log(58) / log(256)
  const bytes = new Uint8Array(size);
  let length = 0;

  // Process the characters
  for (let i = zeros; i < str.length; i++) {
    let carry = ALPHABET_MAP[str[i]];
    if (carry === undefined) {
      throw new Error(`Invalid base58 character: ${str[i]}`);
    }

    let j = 0;

    // Apply "bytes = bytes * 58 + c"
    for (let k = bytes.length - 1; k >= 0; k--, j++) {
      if (carry === 0 && j >= length) break;
      carry += BASE * bytes[k];
      bytes[k] = carry % 256;
      carry = Math.floor(carry / 256);
    }

    length = j;
  }

  // Skip leading zeroes in bytes array
  let i = bytes.length - length;
  while (i < bytes.length && bytes[i] === 0) {
    i++;
  }

  // Prepend the leading zeros
  const result = new Uint8Array(zeros + (bytes.length - i));
  for (let j = 0; j < zeros; j++) {
    result[j] = 0;
  }

  let position = zeros;
  while (i < bytes.length) {
    result[position++] = bytes[i++];
  }

  return result;
}
