import 'dotenv/config';

import { startFlowsServer } from '@genkit-ai/flow';

import { emojiFlow } from './flows/emojiFlow';

const allowedOrigins = process.env['EMOGEN_ALLOWED_ORIGINS']
  ? process.env['EMOGEN_ALLOWED_ORIGINS']
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : undefined;

startFlowsServer({
  flows: [emojiFlow],
  port: process.env['GENKIT_PORT'] ? Number(process.env['GENKIT_PORT']) : 4000,
  pathPrefix: 'api/',
  cors: allowedOrigins?.length ? { origin: allowedOrigins } : undefined
});
