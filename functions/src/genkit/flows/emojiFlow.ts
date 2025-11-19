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
  avoid: z.array(z.string().min(1)).max(10).optional()
});

export type EmojiFlowInput = z.infer<typeof emojiFlowInputSchema>;
export type EmojiFlowResult = z.infer<typeof emojiSetSchema>;

const FALLBACK_EMOJIS = ['🔥', '🚀', '✨', '🎯', '🌈', '🧠', '📝', '💡', '💫', '🍀', '🌊', '🧘‍♂️'];

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
    const { prompt, avoid } = input;
    const client = getOpenAIClient();
    const model = process.env['OPENAI_EMOJI_MODEL'] ?? 'gpt-4o-mini';

    const response = await client.responses.create({
      model,
      temperature: 0.35,
      max_output_tokens: 90,
      input: [
        {
          role: 'system',
          content:
            'You are Emogen, an emoji sommelier. Reply ONLY with JSON {"emojis":["🔥","🚀","✨"],"notes":"short phrase"}. Each emoji must be a single Unicode character that matches the prompt mood. Never repeat emojis from the provided avoid list.'
        },
        {
          role: 'user',
          content: [
            `Prompt: ${prompt}`,
            'Return three different emojis plus a short descriptive note.',
            avoid?.length ? `Avoid entirely: ${avoid.join(' ')}` : undefined
          ]
            .filter(Boolean)
            .join('\n')
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
