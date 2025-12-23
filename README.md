# Emogen

Emoji-driven mood picker built with Angular 20, Tailwind, and a Genkit flow that calls OpenAI’s `gpt-4o-mini`.

## Prerequisites

- Node.js 22+
- npm 10+
- An OpenAI API key (for the Genkit flow)

## Installation

```bash
npm install
cp .env.example .env        # add your OPENAI_API_KEY
```

## Development workflow

| Task | Command | Notes |
| --- | --- | --- |
| Run the Genkit flow server | `npm run genkit:dev` | Loads `.env`, serves `POST /api/emojiFlow` on the port in `GENKIT_PORT` (defaults to 4000). |
| Start Angular dev server | `npm start` | Proxy config forwards `/api/*` calls to the Genkit server, so the UI can call the flow without CORS issues. |
| Build frontend for prod | `npm run build` | Generates `/dist/emogen` (browser + server bundles). |
| Build Genkit bundle | `npm run genkit:build` | Outputs compiled JS to `dist-genkit/` for deployment. |

Both servers must be running locally: the Angular app talks to `/api/emojiFlow`, which the Genkit server exposes.

## Genkit flow overview

- Source: `genkit/flows/emojiFlow.ts`
- Input schema: `{ prompt: string; count?: 3 }`
- Output schema (shared with the Angular app): `EmojiSet` (`id`, `prompt`, 3 emojis, timestamps, optional notes/model)
- Model: `gpt-4o-mini` by default (override via `OPENAI_EMOJI_MODEL`)
- The flow ensures the model returns valid JSON, hard-limits to exactly three emojis, and falls back to a curated emoji pool if parsing fails.
- Served via `genkit/server.ts` using `startFlowsServer` with path prefix `api/`, so the HTTP endpoint is `POST /api/emojiFlow`.

### Environment variables

| Variable | Description |
| --- | --- |
| `OPENAI_API_KEY` | Required. Passed to the OpenAI SDK. |
| `OPENAI_EMOJI_MODEL` | Optional override for the Responses API model. |
| `GENKIT_PORT` | Port used when running `npm run genkit:dev` (default `4000`). |
| `EMOGEN_ALLOWED_ORIGINS` | Comma-separated list of origins allowed by the flow server’s CORS config. |

## Frontend structure

| Path | Purpose |
| --- | --- |
| `src/app/emoji-input` | Reactive form where users describe their vibe. |
| `src/app/results` & `emoji-card` | Displays emoji triplets, copy-to-clipboard, regen + favorite actions. |
| `src/app/history` / `favorites` | LocalStorage-backed panels managed via signals. |
| `src/app/services/*` | Flow client, persistence helpers, and a `EmojiStateService` that orchestrates UI state. |
| `src/styles.scss` & `tailwind.config.js` | Theming tokens, glassmorphism utilities, floating background animations. |

## Running the flow outside dev

1. `npm run genkit:build`
2. Deploy the contents of `dist-genkit/` to your serverless/runtime of choice.
3. Serve `/dist/emogen/browser` statically (GitHub Pages, Cloudflare Pages, etc.).
4. Point the frontend to the deployed flow URL by configuring your host to proxy `/api/*` to the flow or by hosting both under the same domain.

## Chrome Extension

Emogen is also available as a Chrome extension! Generate emojis right from your browser toolbar.

**Location:** `/extension`

**Quick Start:**
1. Deploy your Genkit API (see above)
2. Update `extension/popup/popup.js` with your API endpoint
3. Load the extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked)
4. Click the Emogen icon in your toolbar to start generating emojis

**Documentation:** See `extension/SETUP.md` for complete setup and deployment instructions.

## Testing & linting

- `npm run test` – Angular unit tests (Karma/Jasmine).
- AXE/WCAG passes will be tracked in `AGENTS.md` as the UI matures.
