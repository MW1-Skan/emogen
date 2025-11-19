import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EmojiSet } from '../models/emoji-set';

@Component({
  selector: 'app-history',
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'glass-panel rounded-[var(--radius-xl)] p-6 text-white shadow-emoji-card min-h-[280px] flex flex-col'
  },
  template: `
    <header class="flex flex-col gap-1">
      <p class="text-sm uppercase tracking-[0.35em] text-white/60">History</p>
      <h3 class="text-xl font-semibold">Recent blends</h3>
    </header>
    <div class="mt-6 space-y-3 flex-1">
      @if (history().length === 0) {
        <p class="text-white/60 h-full flex items-center">
          We'll keep the latest 10 emoji sets for you here.
        </p>
      } @else {
        <ol class="flex flex-col gap-3" aria-label="Emoji generation history">
          @for (entry of history(); track entry.id) {
            <li>
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] bg-white/5 px-4 py-3 text-left text-white/80 transition hover:text-white"
                (click)="handleSelect(entry.id)"
              >
                <div class="flex flex-col gap-1">
                  <span class="text-lg">{{ entry.emojis.join(' ') }}</span>
                  <span class="text-xs uppercase text-white/50">{{
                    entry.createdAt | date: 'MMM d · h:mm a'
                  }}</span>
                </div>
                <span class="truncate text-sm text-white/60">{{ entry.prompt }}</span>
              </button>
            </li>
          }
        </ol>
      }
    </div>
  `
})
export class HistoryComponent {
  readonly history = input<EmojiSet[]>([]);
  readonly selected = output<string>();

  protected handleSelect(id: string): void {
    this.selected.emit(id);
  }
}
