"use client";

import { useState } from "react";
import { Key, ExternalLink, Eye, EyeOff, Sparkles, X, Check } from "lucide-react";
import { useApiKeyStore } from "@/stores/apiKeyStore";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "setup" | "settings";
}

export function ApiKeyModal({ isOpen, onClose, mode = "setup" }: ApiKeyModalProps) {
  const { apiKey, setApiKey, clearApiKey } = useApiKeyStore();
  const [inputValue, setInputValue] = useState(apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Please enter your API key");
      return;
    }
    if (!trimmed.startsWith("AI") && trimmed.length < 20) {
      setError("Invalid API key format");
      return;
    }
    setApiKey(trimmed);
    setError(null);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    clearApiKey();
    setInputValue("");
    setError(null);
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.slice(0, 4) + "•".repeat(key.length - 8) + key.slice(-4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={mode === "settings" ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-xl border border-cyber-border bg-cyber-surface p-6 shadow-2xl">
        {/* Close button (only in settings mode) */}
        {mode === "settings" && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-cyber-primary/20 p-2">
            <Key className="h-6 w-6 text-cyber-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === "setup" ? "Welcome to Gemini Deck" : "API Key Settings"}
            </h2>
            <p className="text-sm text-gray-400">
              {mode === "setup"
                ? "Configure your Gemini API key to get started"
                : "Manage your Gemini API key"}
            </p>
          </div>
        </div>

        {/* First-time setup content */}
        {mode === "setup" && (
          <div className="mb-6 rounded-lg border border-cyber-secondary/30 bg-cyber-secondary/10 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyber-secondary" />
              <div>
                <p className="text-sm text-gray-300">
                  To use Gemini Deck, you need a free Gemini API key from Google AI Studio.
                </p>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-cyber-secondary hover:underline"
                >
                  Get your free API key
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Current key display (settings mode) */}
        {mode === "settings" && apiKey && (
          <div className="mb-4 rounded-lg bg-black/50 p-3">
            <p className="mb-1 text-xs text-gray-500">Current API Key</p>
            <p className="font-mono text-sm text-cyber-primary">
              {showKey ? apiKey : maskKey(apiKey)}
            </p>
          </div>
        )}

        {/* Input */}
        <div className="mb-4">
          <label className="mb-2 block text-sm text-gray-400">
            {apiKey ? "Update API Key" : "Enter API Key"}
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              placeholder="AIza..."
              className="w-full rounded-lg border border-cyber-border bg-black px-4 py-3 pr-12 font-mono text-sm text-foreground placeholder-gray-600 outline-none focus:border-cyber-primary"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-cyber-danger">{error}</p>}
        </div>

        {/* Link for settings mode */}
        {mode === "settings" && (
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-cyber-secondary hover:underline"
          >
            Get a new API key
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {mode === "settings" && apiKey && (
            <button
              onClick={handleClear}
              className="rounded-lg border border-cyber-danger/50 px-4 py-2.5 text-sm text-cyber-danger hover:bg-cyber-danger/20"
            >
              Clear Key
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!inputValue.trim() || saved}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              saved
                ? "bg-cyber-primary text-black"
                : "bg-cyber-primary/90 text-black hover:bg-cyber-primary disabled:opacity-50"
            }`}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              "Save API Key"
            )}
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Your API key is stored locally in your browser and never sent to our servers.
        </p>
      </div>
    </div>
  );
}
