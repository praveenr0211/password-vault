/**
 * Password generator utility
 */

export interface PasswordOptions {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

// Characters that look similar: l, 1, I, O, 0
const SIMILAR_CHARS = /[l1IO0]/g;

export function generatePassword(options: PasswordOptions): string {
  let charset = "";
  const required: string[] = [];

  if (options.includeLowercase) {
    charset += LOWERCASE;
    required.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]);
  }

  if (options.includeUppercase) {
    charset += UPPERCASE;
    required.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]);
  }

  if (options.includeNumbers) {
    charset += NUMBERS;
    required.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
  }

  if (options.includeSymbols) {
    charset += SYMBOLS;
    required.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }

  if (options.excludeSimilar) {
    charset = charset.replace(SIMILAR_CHARS, "");
  }

  if (charset.length === 0) {
    throw new Error("At least one character type must be selected");
  }

  // Generate password
  let password = "";
  const passwordArray = new Uint8Array(options.length);
  crypto.getRandomValues(passwordArray);

  // Fill remaining length with random characters
  for (let i = 0; i < options.length - required.length; i++) {
    const randomIndex = passwordArray[i] % charset.length;
    password += charset[randomIndex];
  }

  // Add required characters
  password += required.join("");

  // Shuffle the password
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
    .slice(0, options.length);

  return password;
}

/**
 * Calculate password strength (0-100)
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;

  // Length
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;

  // Character variety
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

  return Math.min(strength, 100);
}
