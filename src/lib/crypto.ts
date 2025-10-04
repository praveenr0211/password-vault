/**
 * Client-side encryption using Web Crypto API
 * PBKDF2 for key derivation + AES-GCM for encryption
 * Only ciphertext is sent to the server
 */

const PBKDF2_ITERATIONS = 100000;
const AES_KEY_LENGTH = 256;

/**
 * Generate a random salt for PBKDF2
 */
export function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return arrayBufferToBase64(salt);
}

/**
 * Derive an encryption key from the user's master password using PBKDF2
 */
async function deriveKey(
  masterPassword: string,
  salt: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(masterPassword);
  const saltBuffer = base64ToArrayBuffer(salt);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  // Derive AES-GCM key
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: AES_KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a JSON object
 */
export async function encryptJSON(
  data: unknown,
  masterPassword: string,
  salt: string
): Promise<string> {
  const key = await deriveKey(masterPassword, salt);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));

  // Generate random IV (96 bits recommended for GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const cipherBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    dataBuffer
  );

  // Combine IV + ciphertext and encode as base64
  const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.length);

  return arrayBufferToBase64(combined);
}

/**
 * Decrypt a ciphertext string
 */
export async function decryptJSON(
  ciphertext: string,
  masterPassword: string,
  salt: string
): Promise<unknown> {
  const key = await deriveKey(masterPassword, salt);
  const combined = base64ToArrayBuffer(ciphertext);

  // Extract IV and ciphertext
  const iv = combined.slice(0, 12);
  const cipherBuffer = combined.slice(12);

  // Decrypt
  const dataBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    cipherBuffer
  );

  // Decode
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(dataBuffer);
  return JSON.parse(jsonString);
}

/**
 * Helper: Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper: Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
