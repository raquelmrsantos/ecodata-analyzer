// app/api/chat/route.ts
import { streamText } from "ai";
import { openrouter, DEFAULT_MODEL, SYSTEM_PROMPT } from "@/lib/agents/config";
import {
  analyzeDataAnomaly,
  generateInsights,
  createReport,
  sendAlert,
} from "@/lib/agents/tools";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter(DEFAULT_MODEL),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      analyzeDataAnomaly,
      generateInsights,
      createReport,
      sendAlert,
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
