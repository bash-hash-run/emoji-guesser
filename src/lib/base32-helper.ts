/**
 * Base32 encoding/decoding helper for CIDv1
 * This implements the RFC4648 base32 encoding with lowercase letters,
 * which is used by CIDv1.
 */

// RFC4648 base32 alphabet (lowercase for CIDv1)
const ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";

// Lookup table for character to value conversion
const ALPHABET_MAP: { [key: string]: number } = {};
for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}

/**
 * Encodes a Uint8Array into a base32 string
 * @param bytes - The bytes to encode
 * @returns Base32 encoded string
 */
export function encode(bytes: Uint8Array): string {
  if (bytes.length === 0) return "";

  let result = "";
  let bits = 0;
  let value = 0;

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      result += ALPHABET[(value >>> bits) & 31];
    }
  }

  // Add padding bits if needed
  if (bits > 0) {
    result += ALPHABET[(value << (5 - bits)) & 31];
  }

  return result;
}

/**
 * Decodes a base32 string into a Uint8Array
 * @param str - The base32 encoded string
 * @returns Decoded bytes as Uint8Array
 */
export function decode(str: string): Uint8Array {
  if (str.length === 0) return new Uint8Array(0);

  // First, calculate how many bytes we'll need
  const byteCount = Math.floor((str.length * 5) / 8);
  const result = new Uint8Array(byteCount);

  let bits = 0;
  let value = 0;
  let index = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i].toLowerCase();
    const charValue = ALPHABET_MAP[char];

    if (charValue === undefined) {
      throw new Error(`Invalid base32 character: ${char}`);
    }

    value = (value << 5) | charValue;
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      result[index++] = (value >>> bits) & 255;
    }
  }

  return result;
}
