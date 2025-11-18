"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__test = exports.emojiFlow = void 0;
const flow_1 = require("@genkit-ai/flow");
const openai_1 = __importDefault(require("openai"));
const node_crypto_1 = require("node:crypto");
const zod_1 = require("zod");
const emojiTripletSchema = zod_1.z
    .array(zod_1.z.string().min(1))
    .min(3)
    .transform((value) => value.slice(0, 3));
const emojiSetSchema = zod_1.z.object({
    id: zod_1.z.string(),
    prompt: zod_1.z.string(),
    emojis: emojiTripletSchema,
    createdAt: zod_1.z.string(),
    model: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional()
});
const emojiFlowInputSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(3, 'Prompt must be at least 3 characters long.'),
    count: zod_1.z.number().int().min(3).max(3).optional(),
    tone: zod_1.z.enum(['playful', 'calm', 'intense']).optional()
});
const FALLBACK_EMOJIS = ['😀', '😎', '🚀', '🌈', '✨', '🔥', '🧠', '🌊', '🪐', '💡', '🎧', '🎉'];
const getOpenAIClient = (() => {
    let client = null;
    return () => {
        if (client) {
            return client;
        }
        const apiKey = process.env['OPENAI_API_KEY'];
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is not set. Add it to your environment before running the flow.');
        }
        client = new openai_1.default({ apiKey });
        return client;
    };
})();
exports.emojiFlow = (0, flow_1.defineFlow)({
    name: 'emojiFlow',
    inputSchema: emojiFlowInputSchema,
    outputSchema: emojiSetSchema
}, async (input) => {
    var _a;
    const { prompt } = input;
    const client = getOpenAIClient();
    const model = (_a = process.env['OPENAI_EMOJI_MODEL']) !== null && _a !== void 0 ? _a : 'gpt-4o-mini';
    const response = await client.responses.create({
        model,
        // Slightly higher temperature so regens vary more often.
        temperature: 0.65,
        max_output_tokens: 150,
        input: [
            {
                role: 'system',
                content: 'You are Emogen, an emoji sommelier. Respond ONLY with strict JSON: {"emojis":["😀","🎉","✨"],"notes":"short descriptive phrase"} and make sure the emojis match the described mood exactly. Each emoji must be a single Unicode emoji character. Avoid duplicates unless requested.'
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
        id: (0, node_crypto_1.randomUUID)(),
        prompt,
        emojis,
        createdAt: new Date().toISOString(),
        model,
        notes: parsed.notes
    };
});
function parseResponse(text) {
    if (text) {
        const jsonPayload = extractJson(text);
        if (jsonPayload) {
            const parsed = safeJson(jsonPayload);
            if (parsed && Array.isArray(parsed['emojis'])) {
                return {
                    emojis: parsed['emojis'],
                    notes: typeof parsed['notes'] === 'string' ? parsed['notes'] : undefined
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
function extractJson(text) {
    var _a;
    const match = text.match(/\{[\s\S]*\}/);
    return (_a = match === null || match === void 0 ? void 0 : match[0]) !== null && _a !== void 0 ? _a : null;
}
function safeJson(payload) {
    try {
        return JSON.parse(payload);
    }
    catch (_a) {
        return null;
    }
}
function extractEmojis(text) {
    var _a;
    return (_a = text.match(/\p{Extended_Pictographic}/gu)) !== null && _a !== void 0 ? _a : [];
}
function pickFallback() {
    const shuffled = [...FALLBACK_EMOJIS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}
exports.__test = {
    parseResponse,
    extractJson,
    extractEmojis,
    pickFallback
};
//# sourceMappingURL=emojiFlow.js.map