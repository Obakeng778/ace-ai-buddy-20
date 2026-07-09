import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const EmailInput = z.object({
  purpose: z.string().min(2).max(500),
  recipient: z.string().max(200).optional().default(""),
  tone: z.enum(["professional", "friendly", "concise", "persuasive", "apologetic", "enthusiastic"]).default("professional"),
  keyPoints: z.string().max(2000).optional().default(""),
  sender: z.string().max(200).optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `Draft a ${data.tone} email.

Purpose: ${data.purpose}
${data.recipient ? `Recipient: ${data.recipient}` : ""}
${data.sender ? `From: ${data.sender}` : ""}
${data.keyPoints ? `Key points to include:\n${data.keyPoints}` : ""}

Return the email exactly in this format (no extra commentary):
Subject: <a compelling subject line>

<email body with greeting, well-structured paragraphs, and a sign-off>`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: "You write clear, well-structured business emails. Never invent facts. Keep it appropriately concise.",
      prompt,
    });
    return { content: text };
  });

const SummaryInput = z.object({
  notes: z.string().min(20).max(20000),
  style: z.enum(["executive", "detailed", "bullets"]).default("executive"),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummaryInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    const styleHint =
      data.style === "executive"
        ? "Write a tight executive summary (3-5 sentences) followed by the sections."
        : data.style === "detailed"
          ? "Write a thorough narrative summary followed by the sections."
          : "Skip the narrative summary. Use only structured bullet lists.";

    const prompt = `Summarize the following meeting notes / transcript. ${styleHint}

Return markdown with these sections (omit a section only if truly empty):

## Summary
<narrative or short overview>

## Key Points
- ...

## Decisions
- ...

## Action Items
- [ ] Owner — task (due date if mentioned)

## Open Questions
- ...

Notes:
"""
${data.notes}
"""`;

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: "You are an expert meeting notes summarizer. Extract only what is present in the input. Do not invent owners, dates, or decisions.",
      prompt,
    });
    return { content: text };
  });
