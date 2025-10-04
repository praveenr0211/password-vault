"use client";

import { useState } from "react";
import {
  generatePassword,
  calculatePasswordStrength,
  PasswordOptions,
} from "@/lib/password-generator";

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
}

export default function PasswordGenerator({
  onPasswordGenerated,
}: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const newPassword = generatePassword({ ...options, length });
    setPassword(newPassword);
    setCopied(false);
    if (onPasswordGenerated) {
      onPasswordGenerated(newPassword);
    }
  };

  const handleCopy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const strength = password ? calculatePasswordStrength(password) : 0;

  const getStrengthColor = () => {
    if (strength < 40) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength < 40) return "Weak";
    if (strength < 70) return "Medium";
    return "Strong";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Password Generator
      </h2>

      {/* Generated Password Display */}
      {password && (
        <div className="mb-6">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={password}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-white"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Strength Meter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Strength:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {getStrengthText()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`${getStrengthColor()} h-2 rounded-full transition-all`}
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Length Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Length
          </label>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {length}
          </span>
        </div>
        <input
          type="range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeLowercase}
            onChange={(e) =>
              setOptions({ ...options, includeLowercase: e.target.checked })
            }
            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
            Lowercase (a-z)
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeUppercase}
            onChange={(e) =>
              setOptions({ ...options, includeUppercase: e.target.checked })
            }
            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
            Uppercase (A-Z)
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeNumbers}
            onChange={(e) =>
              setOptions({ ...options, includeNumbers: e.target.checked })
            }
            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
            Numbers (0-9)
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeSymbols}
            onChange={(e) =>
              setOptions({ ...options, includeSymbols: e.target.checked })
            }
            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
            Symbols (!@#$...)
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.excludeSimilar}
            onChange={(e) =>
              setOptions({ ...options, excludeSimilar: e.target.checked })
            }
            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
          />
          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
            Exclude similar (l, 1, I, O, 0)
          </span>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
      >
        Generate Password
      </button>
    </div>
  );
}
