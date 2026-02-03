"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Terminal,
  Monitor,
  Brain,
  Cpu,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Loader2,
  Key,
} from "lucide-react";
import { ChatConsole } from "@/components/ChatConsole";
import { MemoryStream } from "@/components/MemoryStream";
import { AgentPlanner } from "@/components/AgentPlanner";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { useApiKeyStore } from "@/stores/apiKeyStore";

// Dynamic import for VirtualDisplay to avoid SSR issues with noVNC
// noVNC uses top-level await which isn't supported during server-side rendering
const VirtualDisplay = dynamic(
  () => import("@/components/VirtualDisplay").then((mod) => mod.VirtualDisplay),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-lg border border-cyber-border bg-cyber-surface">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-secondary" />
          <p className="text-cyber-secondary">Loading display...</p>
        </div>
      </div>
    ),
  }
);

type TabId = "chat" | "display" | "memory" | "planner";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: "chat", label: "Chat", icon: <Terminal className="h-4 w-4" /> },
  { id: "display", label: "Display", icon: <Monitor className="h-4 w-4" /> },
  { id: "memory", label: "Memory", icon: <Brain className="h-4 w-4" /> },
  { id: "planner", label: "Auto", icon: <Cpu className="h-4 w-4" /> },
];

export default function Home() {
  const { apiKey } = useApiKeyStore();
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch - only check apiKey after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show setup modal if no API key (after hydration)
  useEffect(() => {
    if (mounted && !apiKey) {
      setShowSetupModal(true);
    } else if (mounted && apiKey) {
      setShowSetupModal(false);
    }
  }, [mounted, apiKey]);

    return (
      <div className="relative flex h-screen bg-background">
        {/* Scanline Overlay */}
        <div className="scanline-overlay" aria-hidden="true" />

        {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-cyber-border bg-cyber-surface transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-cyber-border p-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-cyber-primary/20 p-1.5">
                <Cpu className="h-full w-full text-cyber-primary" />
              </div>
              <div>
                <h1 className="text-glow-primary text-sm font-bold text-cyber-primary">
                  GEMINI
                </h1>
                <p className="text-xs text-gray-500">Command Deck</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded p-1.5 text-gray-400 hover:bg-cyber-border hover:text-white"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                    activeTab === tab.id
                      ? "bg-cyber-primary/20 text-cyber-primary"
                      : "text-gray-400 hover:bg-cyber-border hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{tab.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
          <div className="border-t border-cyber-border p-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                apiKey
                  ? "text-gray-400 hover:bg-cyber-border hover:text-white"
                  : "bg-cyber-warning/20 text-cyber-warning"
              }`}
            >
              {apiKey ? (
                <Settings className="h-4 w-4" />
              ) : (
                <Key className="h-4 w-4" />
              )}
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">
                  {apiKey ? "Settings" : "Add API Key"}
                </span>
              )}
            </button>
          </div>
        </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-cyber-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-gray-500">
              {activeTab === "chat" && "WebSocket Chat Interface"}
              {activeTab === "display" && "Virtual Machine Display"}
              {activeTab === "memory" && "System Memory & Thoughts"}
              {activeTab === "planner" && "Autonomous Agent Planner"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-cyber-primary glow-primary" />
              <span className="text-gray-400">Backend: localhost:8000</span>
            </div>
          </div>
        </header>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden p-4">
            {activeTab === "chat" && <ChatConsole />}
            {activeTab === "display" && <VirtualDisplay />}
            {activeTab === "memory" && <MemoryStream />}
            {activeTab === "planner" && <AgentPlanner />}
          </div>
        </main>

        {/* API Key Setup Modal (first-time) */}
        <ApiKeyModal
          isOpen={showSetupModal && !apiKey}
          onClose={() => setShowSetupModal(false)}
          mode="setup"
        />

        {/* API Key Settings Modal */}
        <ApiKeyModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          mode="settings"
        />
      </div>
    );
  }
