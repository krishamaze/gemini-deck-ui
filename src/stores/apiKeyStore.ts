"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ApiKeyState {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  clearApiKey: () => void;
  isConfigured: () => boolean;
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      apiKey: null,
      setApiKey: (key) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: null }),
      isConfigured: () => !!get().apiKey,
    }),
    {
      name: "gemini_api_key",
    }
  )
);
