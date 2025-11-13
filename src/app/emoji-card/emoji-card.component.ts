import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emoji-card',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'group flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] bg-gradient-to-b from-white/10 to-white/5 px-6 py-8 shadow-emoji-card text-center transition hover:translate-y-[-2px] hover:shadow-2xl focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-background'
  },
  template: `
    <button
      type="button"
      class="flex flex-col items-center gap-2 text-white/80 transition group-focus-visible:outline-none"
      (click)="handleCopy()"
      [attr.aria-label]="copyAriaLabel()"
    >
      <span class="text-5xl sm:text-6xl drop-shadow-lg">{{ emoji() }}</span>
      @if (label()) {
        <span class="text-sm uppercase tracking-wide text-white/70">{{ label() }}</span>
      }
    </button>
  `
})
export class EmojiCardComponent {
  readonly emoji = input.required<string>();
  readonly label = input<string>('');
  readonly copyRequested = output<string>();

  protected handleCopy(): void {
    this.copyRequested.emit(this.emoji());
  }

  protected copyAriaLabel(): string {
    return `Copy emoji ${this.emoji()}`;
  }
}
