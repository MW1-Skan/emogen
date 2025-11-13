import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { EmojiSet } from '../models/emoji-set';
import { environment } from '../../environments/environment';

type EmojiFlowHttpResponse = EmojiSet | { result: EmojiSet };

const FALLBACK_EMOJIS = ['😀', '😎', '🚀', '🌈', '✨', '🔥', '🧠', '🌊', '🪐', '💡', '🎧', '🎉'];

@Injectable({ providedIn: 'root' })
export class EmojiFlowService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.flowEndpoint ?? '/api/emojiFlow';

  async generate(prompt: string): Promise<EmojiSet> {
    const sanitizedPrompt = prompt.trim();

    if (!sanitizedPrompt) {
      return Promise.reject(new Error('Prompt is required'));
    }

    try {
      const response$ = this.http.post<EmojiFlowHttpResponse>(this.endpoint, {
        data: {
          prompt: sanitizedPrompt,
          count: 3
        }
      });
      const payload = await firstValueFrom(response$);
      return 'result' in payload ? payload.result : payload;
    } catch (error) {
      console.warn('[EmojiFlowService] Falling back to mock flow', error);
      return this.generateMock(sanitizedPrompt);
    }
  }

  private async generateMock(prompt: string): Promise<EmojiSet> {
    const mock$ = of(true).pipe(
      delay(350),
      map(() => {
        const pool = [...FALLBACK_EMOJIS];
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
