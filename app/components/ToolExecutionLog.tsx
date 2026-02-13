"use client";

import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface IToolExecution {
  toolCallId: string;
  toolName: string;
  args: Record<string, string>;
  result?: unknown;
  state?: "running" | "success" | "error";
}

interface ToolExecutionLogProps {
  executions: IToolExecution[];
}

export function ToolExecutionLog({ executions }: ToolExecutionLogProps) {
  if (executions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {executions.map((execution: any) => {
        const isSuccess =
          execution.state === "success" ||
          (!!execution.result && execution.state !== "error");
        const isError = execution.state === "error";
        const hasArgs: boolean = Boolean(
          execution.args && Object.keys(execution.args as object).length > 0,
        );

        return (
          <div
            key={execution.toolCallId}
            className={`p-3 rounded-lg border-l-4 ${
              isError
                ? "bg-red-50 border-red-400"
                : isSuccess
                  ? "bg-green-50 border-green-400"
                  : "bg-blue-50 border-blue-400"
            }`}
          >
            {/* Tool Header */}
            <div className="flex items-center gap-2 mb-2">
              {isError ? (
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : isSuccess ? (
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
              )}

              <span className="text-sm font-semibold text-gray-900 flex-1">
                🔧 {String(execution.toolName)}
              </span>

              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isError
                    ? "bg-red-100 text-red-700"
                    : isSuccess
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {isError ? "Error" : isSuccess ? "Complete" : "Running..."}
              </span>
            </div>

            {/* Args Removed for Debugging */}

            {/* Result */}
            {execution.result && (
              <div className="text-xs bg-white bg-opacity-70 p-2 rounded mt-2">
                <strong className="text-green-700">Result:</strong>
                <div className="mt-1 text-gray-800 font-mono whitespace-pre-wrap wrap-break-word">
                  {typeof execution.result === "object"
                    ? JSON.stringify(execution.result, null, 2)
                    : String(execution.result)}
                </div>
              </div>
            )}

            {/* Error State Visual Indicator */}
            {isError && (
              <div className="mt-2 flex items-start gap-2 text-xs text-red-700 bg-red-100 p-2 rounded">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Tool execution failed. Please try again or rephrase your
                  request.
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
