// app/api/chat/route.ts
import { openai, DEFAULT_MODEL, SYSTEM_PROMPT } from "@/lib/agents/config";
import { executeToolCall, tools } from "@/lib/agents/tools";
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources/chat/completions";

interface ToolCallWithIndex extends ChatCompletionMessageToolCall {
  index: number;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const chatMessages: ChatCompletionMessageParam[] = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ];

          const maxIterations = 5; // Prevent infinite loops
          let iteration = 0;

          while (iteration < maxIterations) {
            iteration++;

            const completion = await openai.chat.completions.create({
              model: DEFAULT_MODEL,
              messages: chatMessages,
              tools: tools,
              stream: true,
            });

            let currentContent = "";
            const toolCalls: ChatCompletionMessageToolCall[] = [];
            let currentToolCall: Partial<ToolCallWithIndex> | null = null;

            for await (const chunk of completion) {
              const delta = chunk.choices[0]?.delta;

              // Handle regular text content
              if (delta?.content) {
                currentContent += delta.content;
                controller.enqueue(encoder.encode(delta.content));
              }

              // Handle tool calls
              if (delta?.tool_calls) {
                for (const toolCallDelta of delta.tool_calls) {
                  if (toolCallDelta.index !== undefined) {
                    if (
                      currentToolCall &&
                      currentToolCall.index !== toolCallDelta.index
                    ) {
                      // Finalize previous tool call
                      if (currentToolCall.id && currentToolCall.function) {
                        toolCalls.push(
                          currentToolCall as ChatCompletionMessageToolCall,
                        );
                      }
                      currentToolCall = null;
                    }

                    if (!currentToolCall) {
                      currentToolCall = {
                        index: toolCallDelta.index,
                        id: toolCallDelta.id || "",
                        type: "function",
                        function: {
                          name: toolCallDelta.function?.name || "",
                          arguments: toolCallDelta.function?.arguments || "",
                        },
                      };
                    } else {
                      // Accumulate arguments
                      if (toolCallDelta.function?.arguments) {
                        currentToolCall.function!.arguments +=
                          toolCallDelta.function.arguments;
                      }
                      if (toolCallDelta.function?.name) {
                        currentToolCall.function!.name =
                          toolCallDelta.function.name;
                      }
                      if (toolCallDelta.id) {
                        currentToolCall.id = toolCallDelta.id;
                      }
                    }
                  }
                }
              }

              // Check if streaming is complete
              if (chunk.choices[0]?.finish_reason) {
                // Finalize any remaining tool call
                if (currentToolCall && currentToolCall.id) {
                  toolCalls.push(
                    currentToolCall as ChatCompletionMessageToolCall,
                  );
                }
              }
            }

            // If no tool calls, we're done
            if (toolCalls.length === 0) {
              break;
            }

            // Add assistant message with tool calls
            chatMessages.push({
              role: "assistant",
              content: currentContent || null,
              tool_calls: toolCalls,
            });

            // Execute all tool calls and add results
            for (const toolCall of toolCalls) {
              try {
                const args = JSON.parse(toolCall.function.arguments);
                const result = await executeToolCall(
                  toolCall.function.name,
                  args,
                );

                // Display tool execution
                const toolMessage = `\n\n🔧 **Executing Tool: ${toolCall.function.name}**\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`\n`;
                controller.enqueue(encoder.encode(toolMessage));

                // Add tool result to messages
                chatMessages.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: JSON.stringify(result),
                });
              } catch (error) {
                console.error("Error executing tool:", error);
                const errorMsg = `\n\n❌ **Error executing ${toolCall.function.name}:** ${error}\n`;
                controller.enqueue(encoder.encode(errorMsg));

                chatMessages.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: JSON.stringify({ error: String(error) }),
                });
              }
            }

            // Continue loop to get LLM's response to tool results
          }

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
