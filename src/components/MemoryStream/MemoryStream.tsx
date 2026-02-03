"use client";

import { useState, useEffect, useCallback } from "react";
import { Brain, RefreshCw, Clock, Trash2 } from "lucide-react";

interface Memory {
  id: string;
  content: string;
  type: "thought" | "observation" | "decision" | "action";
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface MemoryStreamProps {
  className?: string;
  pollInterval?: number;
}

export function MemoryStream({
  className = "",
  pollInterval = 5000,
}: MemoryStreamProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  const fetchMemories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/memory/history");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setMemories(data.memories || data || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
      console.error("[MemoryStream] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();

    if (isPolling) {
      const interval = setInterval(fetchMemories, pollInterval);
      return () => clearInterval(interval);
    }
  }, [fetchMemories, pollInterval, isPolling]);

  const getTypeStyles = (type: Memory["type"]) => {
    switch (type) {
      case "thought":
        return "border-l-cyber-primary text-cyber-primary";
      case "observation":
        return "border-l-cyber-secondary text-cyber-secondary";
      case "decision":
        return "border-l-cyber-accent text-cyber-accent";
      case "action":
        return "border-l-cyber-warning text-cyber-warning";
      default:
        return "border-l-gray-500 text-gray-400";
    }
  };

  const getTypeLabel = (type: Memory["type"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div
      className={`flex h-full flex-col rounded-lg border border-cyber-border bg-cyber-surface ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyber-accent" />
          <span className="font-semibold text-cyber-accent">Memory Stream</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPolling(!isPolling)}
            className={`rounded px-2 py-1 text-xs ${
              isPolling
                ? "bg-cyber-primary/20 text-cyber-primary"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {isPolling ? "Auto" : "Paused"}
          </button>
          <button
            onClick={fetchMemories}
            disabled={isLoading}
            className="rounded p-1.5 text-cyber-accent hover:bg-cyber-accent/20 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-cyber-danger">{error}</p>
            <button
              onClick={fetchMemories}
              className="rounded border border-cyber-accent px-4 py-2 text-cyber-accent hover:bg-cyber-accent/20"
            >
              Retry
            </button>
          </div>
        ) : memories.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>No memories recorded yet...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className={`border-l-2 bg-black/30 p-3 ${getTypeStyles(memory.type)}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${getTypeStyles(memory.type)}`}
                  >
                    {getTypeLabel(memory.type)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(memory.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{memory.content}</p>
                {memory.metadata && Object.keys(memory.metadata).length > 0 && (
                  <div className="mt-2 rounded bg-black/50 p-2 text-xs text-gray-500">
                    {JSON.stringify(memory.metadata, null, 2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-cyber-border px-4 py-2 text-xs text-gray-500">
        <span>{memories.length} memories</span>
        {lastUpdated && (
          <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
}
