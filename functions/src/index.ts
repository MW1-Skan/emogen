import cors from 'cors';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { runFlow } from '@genkit-ai/flow';

import { emojiFlow, EmojiFlowInput } from './genkit/flows/emojiFlow';

const allowedOrigins = process.env['EMOGEN_ALLOWED_ORIGINS']
  ? process.env['EMOGEN_ALLOWED_ORIGINS']
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : true; // true => allow all

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.post('/api/emojiFlow', async (req, res) => {
  try {
    const payload: EmojiFlowInput =
      typeof req.body === 'object' && req.body !== null && 'data' in req.body
        ? (req.body as { data: EmojiFlowInput }).data
        : req.body;

    if (!payload || typeof payload.prompt !== 'string') {
      res.status(400).json({ message: 'Prompt is required', recoverable: true });
      return;
    }

    const result = await runFlow(emojiFlow as any, payload);
    res.json(result);
  } catch (error) {
    console.error('[emojiFlow] error', error);
    res.status(500).json({ message: 'Flow failed', recoverable: false });
  }
});

export const api = onRequest(
  {
    region: 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 30,
    secrets: ['OPENAI_API_KEY', 'EMOGEN_ALLOWED_ORIGINS']
  },
  app
);
