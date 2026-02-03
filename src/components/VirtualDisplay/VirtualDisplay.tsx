"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Monitor, Maximize2, Minimize2, RefreshCw, Power } from "lucide-react";

interface VirtualDisplayProps {
  className?: string;
}

export function VirtualDisplay({ className = "" }: VirtualDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rfbRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (rfbRef.current || isConnecting) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      const loadRfb = () =>
        new Promise<void>((resolve, reject) => {
          if ((window as any).RFB) {
            resolve();
            return;
          }

          const script = document.createElement("script");
          script.src = "https://unpkg.com/@novnc/novnc/lib/rfb.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load noVNC"));
          document.body.appendChild(script);
        });

      await loadRfb();
      const RFB = (window as any).RFB;
      if (!RFB) {
        throw new Error("noVNC not available");
      }

      if (!containerRef.current) {
        throw new Error("Container not ready");
      }

      const rfb = new RFB(containerRef.current, "ws://localhost:6080", {
        credentials: { password: "" },
      });

      rfb.scaleViewport = true;
      rfb.resizeSession = true;
      rfb.background = "#0a0a0a";

      rfb.addEventListener("connect", () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log("[VirtualDisplay] Connected to VNC");
      });

      rfb.addEventListener("disconnect", (e: any) => {
        setIsConnected(false);
        setIsConnecting(false);
        rfbRef.current = null;
        if (e.detail.clean) {
          console.log("[VirtualDisplay] Disconnected cleanly");
        } else {
          setError("Connection lost");
          console.log("[VirtualDisplay] Disconnected unexpectedly");
        }
      });

      rfb.addEventListener("credentialsrequired", () => {
        console.log("[VirtualDisplay] Credentials required");
        rfb.sendCredentials({ password: "" });
      });

      rfbRef.current = rfb;
    } catch (err) {
      setIsConnecting(false);
      setError(err instanceof Error ? err.message : "Failed to connect");
      console.error("[VirtualDisplay] Connection error:", err);
    }
  }, [isConnecting]);

  const disconnect = useCallback(() => {
    if (rfbRef.current) {
      rfbRef.current.disconnect();
      rfbRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      disconnect();
    };
  }, [disconnect]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
  }, []);

  return (
    <div
      className={`flex h-full flex-col rounded-lg border border-cyber-border bg-cyber-surface ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-cyber-secondary" />
          <span className="font-semibold text-cyber-secondary">Virtual Display</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={connect}
            disabled={isConnected || isConnecting}
            className="rounded p-1.5 text-cyber-primary hover:bg-cyber-primary/20 disabled:opacity-50"
            title="Reconnect"
          >
            <RefreshCw className={`h-4 w-4 ${isConnecting ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={disconnect}
            disabled={!isConnected}
            className="rounded p-1.5 text-cyber-danger hover:bg-cyber-danger/20 disabled:opacity-50"
            title="Disconnect"
          >
            <Power className="h-4 w-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="rounded p-1.5 text-cyber-secondary hover:bg-cyber-secondary/20"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          <div className="ml-2 flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected
                  ? "bg-cyber-primary glow-primary"
                  : isConnecting
                  ? "bg-cyber-warning cyber-pulse"
                  : "bg-cyber-danger"
              }`}
            />
            <span className="text-xs text-gray-400">
              {isConnected ? "Live" : isConnecting ? "Connecting..." : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Display Area */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-black"
      >
        {!isConnected && !isConnecting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Monitor className="h-16 w-16 text-gray-600" />
            {error ? (
              <>
                <p className="text-cyber-danger">{error}</p>
                <button
                  onClick={connect}
                  className="rounded border border-cyber-primary px-4 py-2 text-cyber-primary hover:bg-cyber-primary/20"
                >
                  Retry Connection
                </button>
              </>
            ) : (
              <p className="text-gray-500">No display connected</p>
            )}
          </div>
        )}
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="h-8 w-8 animate-spin text-cyber-secondary" />
              <p className="text-cyber-secondary">Connecting to display...</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between border-t border-cyber-border px-4 py-2 text-xs text-gray-500">
        <span>ws://localhost:6080</span>
        <span>VNC Protocol</span>
      </div>
    </div>
  );
}
