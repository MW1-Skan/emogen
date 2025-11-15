import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

import { EmojiInputComponent } from './emoji-input/emoji-input.component';
import { ResultsComponent } from './results/results.component';
import { FloatingEmojiBackgroundComponent } from './floating-emoji-background/floating-emoji-background.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { HistoryComponent } from './history/history.component';
import { ToastService } from './toast/toast.service';
import { EmojiStateService } from './services/emoji-state.service';
import { EmojiSet } from './models/emoji-set';
import { environment } from '../environments/environment';
import { SupportingContentComponent } from './supporting-content/supporting-content.component';
import { injectSpeedInsights } from '@vercel/speed-insights';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    EmojiInputComponent,
    ResultsComponent,
    FloatingEmojiBackgroundComponent,
    FavoritesComponent,
    HistoryComponent,
    SupportingContentComponent,
    ToastModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly state = inject(EmojiStateService);
  private readonly toast = inject(ToastService);
  private readonly donationUrl = environment.donationUrl ?? '';

  protected readonly favoriteIds = computed(() => this.state.favorites().map((set) => set.id));

  constructor() {
    injectSpeedInsights({ framework: 'angular' });

    effect(() => {
      const error = this.state.error();
      if (error) {
        this.toast.error(error);
      }
    });
  }

  protected handlePromptSubmit(prompt: string): void {
    void this.state.generate(prompt);
  }

  protected handlePromptCleared(): void {
    this.state.clearError();
  }

  protected handleDonate(): void {
    if (!this.donationUrl) {
      this.toast.info('Donation link coming soon ⏳');
      return;
    }

    window.open(this.donationUrl, '_blank', 'noopener,noreferrer');
  }

  protected handleRegenerate(): void {
    void this.state.regenerate();
  }

  protected handleFavoriteToggle(set: EmojiSet): void {
    this.state.toggleFavorite(set);
  }

  protected handleFavoriteSelected(id: string): void {
    this.state.selectFavorite(id);
  }

  protected handleFavoriteRemoved(id: string): void {
    this.state.removeFavorite(id);
  }

  protected handleHistorySelected(id: string): void {
    this.state.selectHistory(id);
  }

  protected async handleCopyEmoji(emoji: string): Promise<void> {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(emoji);
      } else {
        this.copyViaFallback(emoji);
      }
      this.toast.success('Emoji copied to clipboard ✨');
    } catch {
      this.toast.error('Unable to copy emoji. You can highlight it manually.');
    }
  }

  private copyViaFallback(text: string): void {
    if (typeof document === 'undefined') {
      throw new Error('Clipboard unavailable');
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }

  protected handleToastClick(): void {
    this.toast.clear();
  }
}
