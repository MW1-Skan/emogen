import { defineFlow } from '@genkit-ai/flow';
import OpenAI from 'openai';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

const emojiTripletSchema = z
  .array(z.string().min(1))
  .min(3)
  .transform((value) => value.slice(0, 3) as [string, string, string]);

const emojiSetSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  emojis: emojiTripletSchema,
  createdAt: z.string(),
  model: z.string().optional(),
  notes: z.string().optional()
});

const emojiFlowInputSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters long.'),
  count: z.number().int().min(3).max(3).optional(),
  tone: z.enum(['playful', 'calm', 'intense']).optional()
});

export type EmojiFlowInput = z.infer<typeof emojiFlowInputSchema>;
export type EmojiFlowResult = z.infer<typeof emojiSetSchema>;

const FALLBACK_EMOJIS = ['🎉', '🚀', '✨', '🔥', '🌈', '🧠', '💡', '💫', '🍀', '🌊', '🧘‍♂️', '🎯'];

const getOpenAIClient = (() => {
  let client: OpenAI | null = null;
  return () => {
    if (client) {
      return client;
    }

    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set. Add it to your environment before running the flow.');
    }

    client = new OpenAI({ apiKey });
    return client;
  };
})();

export const emojiFlow = defineFlow(
  {
    name: 'emojiFlow',
    inputSchema: emojiFlowInputSchema,
    outputSchema: emojiSetSchema
  },
  async (input) => {
    const { prompt } = input;
    const client = getOpenAIClient();
    const model = process.env['OPENAI_EMOJI_MODEL'] ?? 'gpt-4o-mini';

    const response = await client.responses.create({
      model,
      // Slightly higher temperature so regens vary more often.
      temperature: 0.65,
      max_output_tokens: 150,
      input: [
        {
          role: 'system',
          content:
            'You are Emogen, an emoji sommelier. Respond ONLY with strict JSON: {"emojis":["🔥","🚀","✨"],"notes":"short descriptive phrase"} and make sure the emojis match the described mood exactly. Each emoji must be a single Unicode emoji character. Avoid duplicates unless requested.'
        },
        {
          role: 'user',
          content: `User prompt: ${prompt}\nReturn exactly three emojis that represent the feeling.`
        }
      ]
    });

    const parsed = parseResponse(response.output_text);
    const emojis = emojiTripletSchema.parse(parsed.emojis);

    return {
      id: randomUUID(),
      prompt,
      emojis,
      createdAt: new Date().toISOString(),
      model,
      notes: parsed.notes
    };
  }
);

function parseResponse(text?: string) {
  if (text) {
    const jsonPayload = extractJson(text);
    if (jsonPayload) {
      const parsed = safeJson(jsonPayload);
      if (parsed && Array.isArray(parsed['emojis'])) {
        return {
          emojis: parsed['emojis'] as string[],
          notes: typeof parsed['notes'] === 'string' ? (parsed['notes'] as string) : undefined
        };
      }
    }

    const extracted = extractEmojis(text);
    if (extracted.length >= 3) {
      return { emojis: extracted.slice(0, 3) };
    }
  }

  return { emojis: pickFallback() };
}

function extractJson(text: string): string | null {
  const match = text.match(/\{[\s\S]*\}/);
  return match?.[0] ?? null;
}

function safeJson(payload: string): Record<string, unknown> | null {
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function extractEmojis(text: string): string[] {
  return text.match(/\p{Extended_Pictographic}/gu) ?? [];
}

function pickFallback(): [string, string, string] {
  const shuffled = [...FALLBACK_EMOJIS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3) as [string, string, string];
}

export const __test = {
  parseResponse,
  extractJson,
  extractEmojis,
  pickFallback
};
