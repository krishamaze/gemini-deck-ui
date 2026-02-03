"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Terminal, Bug, ChevronDown, ChevronUp, Key, AlertCircle } from "lucide-react";
import { useApiKeyStore } from "@/stores/apiKeyStore";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  traceId?: string;
  timestamp: Date;
}

interface WebSocketMessage {
  type: "chunk" | "done" | "error";
  content?: string;
  trace_id?: string;
  error?: string;
}

export function ChatConsole() {
  const { apiKey } = useApiKeyStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [noApiKey, setNoApiKey] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentResponseRef = useRef<string>("");
  const currentTraceIdRef = useRef<string>("");

  const addDebugLog = useCallback((log: string) => {
    const timestamp = new Date().toISOString();
    setDebugLogs((prev) => [...prev.slice(-99), `[${timestamp}] ${log}`]);
    console.log(`[ChatConsole Debug] ${log}`);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    if (!apiKey) {
      setNoApiKey(true);
      addDebugLog("No API key configured");
      return;
    }
    setNoApiKey(false);

    // Build WebSocket URL - use env var or detect dynamically for tunnel/mobile support
    const getWsUrl = () => {
      if (process.env.NEXT_PUBLIC_WS_URL) {
        return process.env.NEXT_PUBLIC_WS_URL;
      }
      // Dynamic detection: use current host with ws/wss protocol
      if (typeof window !== "undefined") {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.host;
        // If running on localhost:3000 (dev), connect to backend on 8000
        if (host.includes("localhost:3000") || host.includes("127.0.0.1:3000")) {
          return "ws://localhost:8000";
        }
        // Otherwise assume same host (tunnel/production with reverse proxy)
        return `${protocol}//${host}`;
      }
      return "ws://localhost:8000";
    };

    const wsBaseUrl = getWsUrl();
    const wsUrl = `${wsBaseUrl}/api/chat/stream?api_key=${encodeURIComponent(apiKey)}`;
    addDebugLog(`Connecting to ${wsUrl.replace(apiKey, "***")}`);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      addDebugLog("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        addDebugLog(`Received: type=${data.type}, trace_id=${data.trace_id || "N/A"}`);

        if (data.trace_id && data.trace_id !== currentTraceIdRef.current) {
          currentTraceIdRef.current = data.trace_id;
          addDebugLog(`New trace_id: ${data.trace_id}`);
        }

        if (data.type === "chunk" && data.content) {
          currentResponseRef.current += data.content;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg?.role === "assistant" && lastMsg.id === "streaming") {
              lastMsg.content = currentResponseRef.current;
              lastMsg.traceId = currentTraceIdRef.current;
              return [...newMessages];
            }
            return prev;
          });
        } else if (data.type === "done") {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg?.id === "streaming") {
              lastMsg.id = crypto.randomUUID();
              lastMsg.traceId = currentTraceIdRef.current;
            }
            return newMessages;
          });
          setIsStreaming(false);
          currentResponseRef.current = "";
          addDebugLog(`Stream complete. Final trace_id: ${currentTraceIdRef.current}`);
        } else if (data.type === "error") {
          addDebugLog(`Error: ${data.error}`);
          setIsStreaming(false);
        }
      } catch (e) {
        addDebugLog(`Parse error: ${e}`);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      addDebugLog("WebSocket disconnected");
      setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      addDebugLog(`WebSocket error: ${error}`);
    };

    wsRef.current = ws;
  }, [addDebugLog, apiKey]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  // Reconnect when API key changes
  useEffect(() => {
    if (apiKey) {
      wsRef.current?.close();
      wsRef.current = null;
      connect();
    }
  }, [apiKey]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || isStreaming) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    addDebugLog(`Sending message: "${input.trim().substring(0, 50)}..."`);

    wsRef.current.send(JSON.stringify({ message: input.trim() }));

    const assistantPlaceholder: ChatMessage = {
      id: "streaming",
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantPlaceholder]);
    setIsStreaming(true);
    currentResponseRef.current = "";
    currentTraceIdRef.current = "";
    setInput("");
  };

  const renderMarkdown = (content: string) => {
    // Basic markdown rendering - code blocks, bold, italic
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent = "";
    let codeLanguage = "";

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = "";
        } else {
          elements.push(
            <pre
              key={idx}
              className="my-2 overflow-x-auto rounded bg-cyber-surface p-3 text-sm"
            >
              <code className="text-cyber-secondary">{codeContent}</code>
            </pre>
          );
          inCodeBlock = false;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        return;
      }

      // Process inline formatting
      let processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyber-primary">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-cyber-secondary">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="rounded bg-cyber-surface px-1 text-cyber-accent">$1</code>');

      elements.push(
        <p
          key={idx}
          className="leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processed || "&nbsp;" }}
        />
      );
    });

    return elements;
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-cyber-border bg-cyber-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-cyber-primary" />
          <span className="font-semibold text-cyber-primary">Chat Console</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center gap-1 text-sm text-cyber-secondary hover:text-cyber-primary"
          >
            <Bug className="h-4 w-4" />
            Debug
            {showDebug ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-cyber-primary glow-primary" : "bg-cyber-danger"
              }`}
            />
            <span className="text-xs text-gray-400">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="max-h-32 overflow-y-auto border-b border-cyber-border bg-black/50 p-2 font-mono text-xs">
          {debugLogs.length === 0 ? (
            <p className="text-gray-500">No debug logs yet...</p>
          ) : (
            debugLogs.map((log, idx) => (
              <p key={idx} className="text-cyber-warning">
                {log}
              </p>
            ))
          )}
        </div>
      )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {noApiKey ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-full bg-cyber-warning/20 p-4">
                <Key className="h-8 w-8 text-cyber-warning" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">API Key Required</p>
                <p className="mt-1 text-sm text-gray-400">
                  Configure your Gemini API key in Settings to start chatting.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-cyber-warning/30 bg-cyber-warning/10 px-4 py-2 text-sm text-cyber-warning">
                <AlertCircle className="h-4 w-4" />
                Click Settings in the sidebar to add your key
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              <p>Start a conversation...</p>
            </div>
          ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-cyber-primary/20 text-cyber-primary"
                      : "border border-cyber-border bg-black/50"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="text-gray-200">{renderMarkdown(msg.content)}</div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  {msg.traceId && (
                    <p className="mt-1 text-xs text-gray-500">
                      trace: {msg.traceId.substring(0, 8)}...
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex items-center gap-2 text-cyber-secondary">
                <span className="cyber-pulse">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-cyber-border p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Enter command..."
            className="flex-1 rounded border border-cyber-border bg-black px-4 py-2 text-foreground placeholder-gray-500 outline-none focus:border-cyber-primary"
            disabled={!isConnected || isStreaming}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || isStreaming || !input.trim()}
            className="rounded bg-cyber-primary px-4 py-2 text-black transition-all hover:glow-primary disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
