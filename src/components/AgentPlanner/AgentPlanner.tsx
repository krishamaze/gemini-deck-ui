"use client";

import { useState, useCallback } from "react";
import {
  Cpu,
  Play,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";

interface PlanStep {
  id: number;
  action: string;
  description: string;
  tool: string;
  status?: "pending" | "running" | "completed" | "error";
}

interface Plan {
  goal: string;
  steps: PlanStep[];
}

interface AgentPlannerProps {
  className?: string;
}

export function AgentPlanner({ className = "" }: AgentPlannerProps) {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const generatePlan = useCallback(async () => {
    if (!goal.trim()) return;

    setIsPlanning(true);
    setError(null);
    setPlan(null);

    try {
      const response = await fetch("http://localhost:8000/api/agent/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: goal.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: Plan = await response.json();
      setPlan({
        ...data,
        steps: data.steps.map((step) => ({ ...step, status: "pending" })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan");
      console.error("[AgentPlanner] Planning error:", err);
    } finally {
      setIsPlanning(false);
    }
  }, [goal]);

  const executePlan = useCallback(async () => {
    if (!plan) return;

    setIsExecuting(true);
    setError(null);

    // Simulate step-by-step execution (in real implementation, this would call backend)
    for (let i = 0; i < plan.steps.length; i++) {
      setPlan((prev) => {
        if (!prev) return null;
        const newSteps = [...prev.steps];
        newSteps[i] = { ...newSteps[i], status: "running" };
        return { ...prev, steps: newSteps };
      });

      // Simulate execution time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPlan((prev) => {
        if (!prev) return null;
        const newSteps = [...prev.steps];
        newSteps[i] = { ...newSteps[i], status: "completed" };
        return { ...prev, steps: newSteps };
      });
    }

    setIsExecuting(false);
  }, [plan]);

  const resetPlan = () => {
    setPlan(null);
    setGoal("");
    setError(null);
  };

  const getStepIcon = (status?: PlanStep["status"]) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-cyber-secondary" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-cyber-primary" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-cyber-danger" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getToolBadgeColor = (tool: string) => {
    switch (tool.toLowerCase()) {
      case "shell":
        return "bg-cyber-primary/20 text-cyber-primary";
      case "browser":
        return "bg-cyber-secondary/20 text-cyber-secondary";
      case "file":
        return "bg-cyber-accent/20 text-cyber-accent";
      default:
        return "bg-gray-700 text-gray-400";
    }
  };

  const allCompleted = plan?.steps.every((s) => s.status === "completed");

  return (
    <div
      className={`flex h-full flex-col rounded-lg border border-cyber-border bg-cyber-surface ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-cyber-warning" />
          <span className="font-semibold text-cyber-warning">Auto Mode</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {expanded && (
        <>
          {/* Goal Input */}
          <div className="border-b border-cyber-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generatePlan()}
                placeholder="Enter a goal (e.g., Install nginx and start the service)"
                className="flex-1 rounded border border-cyber-border bg-black px-4 py-2 text-sm text-foreground placeholder-gray-500 outline-none focus:border-cyber-warning"
                disabled={isPlanning || isExecuting}
              />
              <button
                onClick={generatePlan}
                disabled={!goal.trim() || isPlanning || isExecuting}
                className="rounded bg-cyber-warning px-4 py-2 text-sm font-medium text-black transition-all hover:opacity-80 disabled:opacity-50"
              >
                {isPlanning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Plan Display */}
          <div className="flex-1 overflow-y-auto p-4">
            {error && (
              <div className="mb-4 rounded bg-cyber-danger/20 p-3 text-sm text-cyber-danger">
                {error}
              </div>
            )}

            {!plan && !isPlanning && (
              <div className="flex h-full items-center justify-center text-gray-500">
                <p>Enter a goal to generate an execution plan</p>
              </div>
            )}

            {isPlanning && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-cyber-warning" />
                  <p className="text-cyber-warning">Generating plan...</p>
                </div>
              </div>
            )}

            {plan && (
              <div className="space-y-4">
                <div className="rounded bg-black/30 p-3">
                  <p className="text-xs text-gray-500">Goal</p>
                  <p className="text-sm text-white">{plan.goal}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Execution Steps</p>
                  {plan.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 rounded border p-3 ${
                        step.status === "running"
                          ? "border-cyber-secondary bg-cyber-secondary/10"
                          : step.status === "completed"
                          ? "border-cyber-primary/50 bg-cyber-primary/5"
                          : "border-cyber-border bg-black/30"
                      }`}
                    >
                      <div className="mt-0.5">{getStepIcon(step.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">#{step.id}</span>
                          <span
                            className={`rounded px-2 py-0.5 text-xs ${getToolBadgeColor(
                              step.tool
                            )}`}
                          >
                            {step.tool}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-300">
                          {step.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Action: {step.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {plan && (
            <div className="flex gap-2 border-t border-cyber-border p-4">
              {allCompleted ? (
                <button
                  onClick={resetPlan}
                  className="flex-1 rounded bg-cyber-secondary px-4 py-2 text-sm font-medium text-black"
                >
                  New Plan
                </button>
              ) : (
                <>
                  <button
                    onClick={resetPlan}
                    disabled={isExecuting}
                    className="rounded border border-gray-600 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 disabled:opacity-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={executePlan}
                    disabled={isExecuting}
                    className="flex flex-1 items-center justify-center gap-2 rounded bg-cyber-primary px-4 py-2 text-sm font-medium text-black hover:opacity-80 disabled:opacity-50"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Execute Plan
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
