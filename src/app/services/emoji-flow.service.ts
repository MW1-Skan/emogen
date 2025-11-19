import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { EmojiSet } from '../models/emoji-set';
import { environment } from '../../environments/environment';

type EmojiFlowHttpResponse = EmojiSet | { result: EmojiSet };
type GenerateOptions = { avoid?: readonly string[] };

const FALLBACK_EMOJIS = ['😀', '😎', '🚀', '🌈', '✨', '🔥', '🧠', '🌊', '🪐', '💡', '🎧', '🎉'];

@Injectable({ providedIn: 'root' })
export class EmojiFlowService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.flowEndpoint ?? '/api/emojiFlow';

  async generate(prompt: string, options?: GenerateOptions): Promise<EmojiSet> {
    const sanitizedPrompt = prompt.trim();

    if (!sanitizedPrompt) {
      return Promise.reject(new Error('Prompt is required'));
    }

    try {
      const body: Record<string, unknown> = { prompt: sanitizedPrompt };
      if (options?.avoid?.length) {
        body['avoid'] = options.avoid;
      }

      const response$ = this.http.post<EmojiFlowHttpResponse>(this.endpoint, {
        data: body
      });
      const payload = await firstValueFrom(response$);
      return 'result' in payload ? payload.result : payload;
    } catch (error) {
      console.warn('[EmojiFlowService] Falling back to mock flow', error);
      return this.generateMock(sanitizedPrompt, options?.avoid);
    }
  }

  private async generateMock(prompt: string, avoid?: readonly string[]): Promise<EmojiSet> {
    const mock$ = of(true).pipe(
      delay(350),
      map(() => {
        const exclusion = new Set(avoid ?? []);
        let pool = FALLBACK_EMOJIS.filter((emoji) => !exclusion.has(emoji));
        if (pool.length < 3) {
          pool = [...new Set([...pool, ...FALLBACK_EMOJIS])];
        }
        const emojis = pool.sort(() => 0.5 - Math.random()).slice(0, 3) as EmojiSet['emojis'];
        const id =
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `mock-${Date.now()}-${Math.random().toString(16).slice(2)}`;

        return {
          id,
          prompt,
          emojis,
          createdAt: new Date().toISOString(),
          model: 'mock'
        };
      })
    );

    return await firstValueFrom(mock$);
  }
}
