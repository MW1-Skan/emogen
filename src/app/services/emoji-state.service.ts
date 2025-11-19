import { Injectable, computed, inject, signal } from '@angular/core';

import { EmojiSet } from '../models/emoji-set';
import { EmojiFlowService } from './emoji-flow.service';
import { EmojiPersistenceService } from './emoji-persistence.service';

const HISTORY_LIMIT = 10;

@Injectable({ providedIn: 'root' })
export class EmojiStateService {
  private readonly flow = inject(EmojiFlowService);
  private readonly persistence = inject(EmojiPersistenceService);

  private readonly promptSignal = signal('');
  private readonly resultSignal = signal<EmojiSet | null>(null);
  private readonly historySignal = signal<EmojiSet[]>([]);
  private readonly favoritesSignal = signal<EmojiSet[]>([]);
  private readonly isGeneratingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly prompt = this.promptSignal.asReadonly();
  readonly result = this.resultSignal.asReadonly();
  readonly history = this.historySignal.asReadonly();
  readonly favorites = this.favoritesSignal.asReadonly();
  readonly isGenerating = this.isGeneratingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly hasResult = computed(() => this.resultSignal() !== null);
  readonly canRegenerate = computed(() => !!this.promptSignal().trim() && !this.isGeneratingSignal());

  constructor() {
    const persisted = this.persistence.load();
    this.historySignal.set(persisted.history ?? []);
    this.favoritesSignal.set(persisted.favorites ?? []);
  }

  async generate(prompt: string, options?: { avoid?: readonly string[] }): Promise<void> {
    const previousPrompt = this.promptSignal();
    const previousResult = this.resultSignal();
    const normalized = prompt.trim();
    if (!normalized) {
      this.errorSignal.set('Please describe how you feel first.');
      return;
    }

    this.promptSignal.set(normalized);
    this.isGeneratingSignal.set(true);
    this.errorSignal.set(null);

    const derivedAvoid =
      options?.avoid ??
      (previousResult && previousPrompt.trim() === normalized ? previousResult.emojis : undefined);

    try {
      const result = await this.flow.generate(normalized, { avoid: derivedAvoid });
      this.resultSignal.set(result);
      this.recordHistory(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to generate emojis right now.';
      this.errorSignal.set(message);
    } finally {
      this.isGeneratingSignal.set(false);
      this.persist();
    }
  }

  async regenerate(): Promise<void> {
    if (!this.canRegenerate()) {
      return;
    }

    await this.generate(this.promptSignal(), { avoid: this.resultSignal()?.emojis });
  }

  toggleFavorite(set: EmojiSet): void {
    this.favoritesSignal.update((favorites) => {
      const exists = favorites.some((entry) => entry.id === set.id);
      const next = exists ? favorites.filter((entry) => entry.id !== set.id) : [set, ...favorites];

      queueMicrotask(() => this.persist());

      return next;
    });
  }

  selectHistory(id: string): void {
    const match = this.historySignal().find((entry) => entry.id === id);
    if (!match) {
      return;
    }

    this.promptSignal.set(match.prompt);
    this.resultSignal.set(match);
  }

  selectFavorite(id: string): void {
    const match = this.favoritesSignal().find((entry) => entry.id === id);
    if (!match) {
      return;
    }

    this.promptSignal.set(match.prompt);
    this.resultSignal.set(match);
  }

  removeFavorite(id: string): void {
    this.favoritesSignal.update((favorites) => {
      const next = favorites.filter((entry) => entry.id !== id);
      queueMicrotask(() => this.persist());
      return next;
    });
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private recordHistory(entry: EmojiSet): void {
    this.historySignal.update((history) => {
      const next = [entry, ...history.filter((item) => item.id !== entry.id)].slice(0, HISTORY_LIMIT);
      queueMicrotask(() => this.persist());
      return next;
    });
  }

  private persist(): void {
    this.persistence.save({
      history: this.historySignal(),
      favorites: this.favoritesSignal()
    });
  }
}
