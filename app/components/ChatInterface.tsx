"use client";

import { Send, Loader2, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatInterfaceProps {
  datasetId?: string;
}

export function ChatInterface({ datasetId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !datasetId || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          datasetId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      const assistantId = crypto.randomUUID();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        // Update messages with streaming content
        setMessages((prev) => {
          const existing = prev.find((m) => m.id === assistantId);
          if (existing) {
            return prev.map((m) =>
              m.id === assistantId ? { ...m, content: assistantMessage } : m,
            );
          }
          return [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: assistantMessage,
            },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[700px] border border-gray-200 rounded-xl bg-white shadow-lg">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-xl">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          AI Analysis Assistant
        </h2>
        {datasetId && (
          <p className="text-xs text-indigo-100 mt-1">
            Dataset loaded • Ready to analyze
          </p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!datasetId ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">
              Upload a dataset to start analyzing
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Drag and drop a CSV or JSON file to begin
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Dataset loaded! Ask me to analyze your data.
            </p>
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              <button
                onClick={() => {
                  setInput("Analyze the data for anomalies");
                  setTimeout(() => handleSubmit(), 0);
                }}
                className="text-sm px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
              >
                🔍 Detect anomalies
              </button>
              <button
                onClick={() => {
                  setInput("Generate efficiency insights");
                  setTimeout(() => handleSubmit(), 0);
                }}
                className="text-sm px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                💡 Get insights
              </button>
              <button
                onClick={() => {
                  setInput("Create a comprehensive report");
                  setTimeout(() => handleSubmit(), 0);
                }}
                className="text-sm px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
              >
                📊 Generate report
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : message.role === "system"
                      ? "bg-green-50 text-green-900 border border-green-200"
                      : "bg-gray-100 text-gray-900"
                }`}
              >
                {/* Message Content */}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
              <span className="text-sm text-gray-600">Analyzing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="border-t p-4 bg-gray-50 rounded-b-xl"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              datasetId
                ? "Ask me to analyze the data..."
                : "Upload a dataset first..."
            }
            disabled={!datasetId || isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          />
          <button
            type="submit"
            disabled={!datasetId || isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Helper Text */}
        {datasetId && !isLoading && messages.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Try: &ldquo;Show me cost reduction opportunities&rdquo; or
            &ldquo;Alert me about critical issues&rdquo;
          </p>
        )}
      </form>
    </div>
  );
}
