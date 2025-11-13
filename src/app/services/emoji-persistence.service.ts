import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { EmojiSet } from '../models/emoji-set';

interface PersistedState {
  history: EmojiSet[];
  favorites: EmojiSet[];
}

const STORAGE_KEY = 'emogen_state_v1';

@Injectable({ providedIn: 'root' })
export class EmojiPersistenceService {
  private readonly platformId = inject(PLATFORM_ID);

  load(): PersistedState {
    if (!this.isBrowser()) {
      return { history: [], favorites: [] };
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { history: [], favorites: [] };
      }

      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        history: parsed.history ?? [],
        favorites: parsed.favorites ?? []
      };
    } catch {
      return { history: [], favorites: [] };
    }
  }

  save(next: PersistedState): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('[EmojiPersistenceService] Unable to persist state', error);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
