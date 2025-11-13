import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmojiSet } from '../models/emoji-set';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glass-panel rounded-[var(--radius-xl)] p-6 text-white shadow-emoji-card'
  },
  template: `
    <header class="flex flex-col gap-1">
      <p class="text-sm uppercase tracking-[0.35em] text-white/60">Favorites</p>
      <h3 class="text-xl font-semibold">Saved combos</h3>
    </header>

    <div class="mt-6 space-y-4">
      @if (favorites().length === 0) {
        <p class="text-white/60">Favorite a result to quickly reuse it later.</p>
      } @else {
        <ul class="flex flex-col gap-3" aria-label="Favorite emoji sets">
          @for (favorite of favorites(); track favorite.id) {
            <li
              class="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-white/5 px-4 py-3 backdrop-blur"
            >
              <button
                type="button"
                class="flex flex-1 items-center gap-3 text-left text-white/80 transition hover:text-white"
                (click)="handleSelect(favorite.id)"
              >
                <span class="text-2xl">{{ favorite.emojis.join(' ') }}</span>
                <span class="truncate text-sm text-white/60">{{ favorite.prompt }}</span>
              </button>
              <button
                type="button"
                class="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide text-white/60 transition hover:border-white/40 hover:text-white"
                (click)="handleRemove(favorite.id)"
                aria-label="Remove favorite"
              >
                Remove
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `
})
export class FavoritesComponent {
  readonly favorites = input<EmojiSet[]>([]);

  readonly selected = output<string>();
  readonly removed = output<string>();

  protected handleSelect(id: string): void {
    this.selected.emit(id);
  }

  protected handleRemove(id: string): void {
    this.removed.emit(id);
  }
}
