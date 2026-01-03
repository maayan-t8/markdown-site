import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Action to generate a response from Anthropic's Claude API
export const generateResponse = action({
  args: {
    chatId: v.id("aiChats"),
    userMessage: v.string(),
    model: v.optional(v.string()),
    pageContext: v.optional(v.string()),
    attachments: v.optional(v.array(
      v.object({
        type: v.union(v.literal("image"), v.literal("link")),
        storageId: v.optional(v.id("_storage")),
        url: v.optional(v.string()),
        scrapedContent: v.optional(v.string()),
        title: v.optional(v.string()),
      }),
    )),
  },
  handler: async (ctx, { chatId, userMessage, model, pageContext, attachments }) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set in the Convex dashboard environment variables.",
      );
    }

    const chat = await ctx.runQuery(api.aiChats.get, { id: chatId });

    if (!chat) {
      return;
    }

    const messages = chat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    if(pageContext) {
        messages.unshift({
            role: "user",
            content: `Here is the page context:\n\n${pageContext}`
        });
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: model || "claude-3-sonnet-20240229",
          max_tokens: 1024,
          messages: [...messages, { role: "user", content: userMessage }],
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API error: ${response.statusText} - ${errorText}`);
      }
      
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
            if(line.startsWith("data:")) {
                const data = JSON.parse(line.substring(5));
                if(data.type === 'content_block_delta') {
                    const text = data.delta.text;
                    fullResponse += text;
                     await ctx.runMutation(api.aiChats.updateAssistantMessage, {
                        chatId,
                        assistantResponse: fullResponse,
                     });
                }
            }
        }
      }

    } catch (error) {
      console.error("Error calling Anthropic API:", error);
      throw error;
    }
  },
});