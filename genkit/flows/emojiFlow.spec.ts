import assert from 'node:assert/strict';
import { test } from 'node:test';

import { __test } from './emojiFlow';

const { parseResponse, extractJson, extractEmojis } = __test;

test('parses strict JSON with notes', () => {
  const result = parseResponse('{"emojis":["🔥","🚀","✨"],"notes":"launch hype"}');
  assert.deepEqual(result.emojis, ['🔥', '🚀', '✨']);
  assert.equal(result.notes, 'launch hype');
});

test('extracts JSON payload from noisy model output', () => {
  const payload = 'Here you go!\n{"emojis":["🌊","🧘‍♂️","🌙"],"notes":"calm night vibes"}\nThanks!';
  const result = parseResponse(payload);
  assert.deepEqual(result.emojis, ['🌊', '🧘‍♂️', '🌙']);
  assert.equal(result.notes, 'calm night vibes');
});

test('falls back to emoji scraping when JSON is missing', () => {
  const result = parseResponse('Try these: 💡🎉🤝');
  assert.deepEqual(result.emojis, ['💡', '🎉', '🤝']);
  assert.equal(result.notes, undefined);
});

test('returns a shuffled fallback set when nothing is parseable', () => {
  const result = parseResponse('nonsense response with no emoji');
  assert.equal(result.emojis.length, 3);
  assert(result.emojis.every((emoji) => typeof emoji === 'string' && emoji.length > 0));
});

test('extractJson pulls the first JSON object present', () => {
  const text = 'prefix {"emojis":["🍕","🎮","🎧"]} trailing text';
  assert.equal(extractJson(text), '{"emojis":["🍕","🎮","🎧"]}');
});

test('extractEmojis collects pictographic characters', () => {
  const extracted = extractEmojis('mix of emojis 🎯🏝️⚡ and text');
  assert.equal(extracted[0], '🎯');
  // Some environments strip variation selectors, so allow either form.
  assert(extracted.includes('🏝') || extracted.includes('🏝️'));
  assert(extracted.includes('⚡'));
});
