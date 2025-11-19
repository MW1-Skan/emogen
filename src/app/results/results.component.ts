import { ChangeDetectionStrategy, Component, Signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmojiSet } from '../models/emoji-set';
import { EmojiCardComponent } from '../emoji-card/emoji-card.component';

@Component({
  selector: 'app-results',
  imports: [CommonModule, EmojiCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'glass-panel rounded-[var(--radius-xl)] p-6 md:p-8 text-white shadow-emoji-card min-h-[360px] flex flex-col'
  },
  template: `
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-1">
        <p class="text-sm uppercase tracking-[0.35em] text-white/60">Results</p>
        <h2 class="text-2xl font-semibold">Your emoji trio</h2>
        @if (hasResult()) {
          <p class="text-white/60 text-sm">{{ result()?.prompt }}</p>
        }
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/40"
          [disabled]="!canRegenerate()"
          (click)="handleRegenerate()"
        >
          Regenerate
        </button>
        <button
          type="button"
          class="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/40"
          [disabled]="!hasResult()"
          (click)="handleFavoriteToggle()"
        >
          @if (isFavorite()) {
            <span>Favorited</span>
          } @else {
            <span>Add to favorites</span>
          }
        </button>
      </div>
    </header>

    <div class="mt-8 flex-1">
      @if (isLoading()) {
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3" aria-live="polite">
          @for (placeholder of skeletonPlaceholders; track placeholder) {
            <div
              class="h-32 rounded-[var(--radius-lg)] bg-white/10 animate-pulse"
              aria-hidden="true"
            ></div>
          }
        </div>
      } @else if (error(); as message) {
        <p class="text-red-300 min-h-[128px] flex items-center">{{ message }}</p>
      } @else if (hasResult()) {
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          @for (emoji of result()?.emojis ?? []; track emoji) {
            <app-emoji-card [emoji]="emoji" (copyRequested)="handleCopy($event)"></app-emoji-card>
          }
        </div>
      } @else {
        <p class="text-white/60 min-h-[128px] flex items-center">
          Describe what's happening and we'll suggest the perfect emoji combination.
        </p>
      }
    </div>
  `
})
export class ResultsComponent {
  readonly result = input<EmojiSet | null>(null);
  readonly error = input<string | null>(null);
  readonly isLoading = input(false);
  readonly canRegenerate = input(false);
  readonly favoriteIds = input<string[]>([]);

  readonly regenerate = output<void>();
  readonly favoriteToggle = output<EmojiSet>();
  readonly copyEmoji = output<string>();

  protected readonly hasResult: Signal<boolean> = computed(() => !!this.result());
  protected readonly skeletonPlaceholders = [0, 1, 2];
  protected readonly isFavorite = computed(() => {
    const ids = this.favoriteIds() ?? [];
    const current = this.result();
    return !!current && ids.includes(current.id);
  });

  protected handleRegenerate(): void {
    if (!this.canRegenerate()) {
      return;
    }
    this.regenerate.emit();
  }

  protected handleFavoriteToggle(): void {
    const current = this.result();
    if (!current) {
      return;
    }

    this.favoriteToggle.emit(current);
  }

  protected handleCopy(emoji: string): void {
    this.copyEmoji.emit(emoji);
  }
}
