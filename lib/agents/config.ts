import { createOpenAI } from "@ai-sdk/openai";

// Configure OpenRouter as an OpenAI-compatible provider
export const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
});

// Free models available on OpenRouter
export const FREE_MODELS = {
  GEMINI_FLASH: "google/gemini-flash-1.5-8b",
  LLAMA_3_2: "meta-llama/llama-3.2-3b-instruct",
  QWEN: "qwen/qwen-2.5-7b-instruct",
} as const;

export const DEFAULT_MODEL = FREE_MODELS.GEMINI_FLASH;

// System prompt for the AI agent
export const SYSTEM_PROMPT = `You are an expert energy and sustainability data analyst assistant.

Your role:
1. Analyze energy consumption and sustainability reports
2. Identify anomalies and inefficiencies in data
3. Provide actionable recommendations based on industry best practices
4. Generate clear, professional reports

Available tools:
- analyzeDataAnomaly: Detect outliers in datasets
- generateInsights: Provide improvement recommendations
- createReport: Generate structured reports
- sendAlert: Create notifications for critical issues

Always explain your reasoning before executing tools.
Be precise, data-driven, and helpful in your analysis.
Keep responses concise and actionable.`;
