import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type FloatingEmoji = {
  id: string;
  value: string;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  animation: 'float' | 'drift';
};

const FLOATING_EMOJIS = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😎',
  '🥳',
  '🤩',
  '😍',
  '🤗',
  '🤠',
  '😇',
  '🫶',
  '✨',
  '⭐',
  '🌟',
  '⚡',
  '🔥',
  '🌈',
  '💫',
  '🌊',
  '🍀',
  '🌸',
  '🌼',
  '🪐',
  '🌙',
  '☁️',
  '❄️',
  '🎉',
  '🎊',
  '🎈',
  '🎶',
  '🎧',
  '💡',
  '💖',
  '💛',
  '💙',
  '💜',
  '💚',
  '🧠',
  '🚀',
  '🛸',
  '🪄',
  '🧸',
  '🍭',
  '🍩',
  '🫧',
  '🍉',
  '🍓',
  '🍒',
  '🌶️',
  '🥨',
  '🧃',
  '🍹',
  '🪁',
  '🦋',
  '🐝',
  '🐬',
  '🦄',
  '🐠',
  '🐚',
  '🕊️',
  '🌻',
  '🌺',
  '🌹',
  '🌷',
  '🌿',
  '🍂',
  '🪷',
  '🪸',
  '🧊',
  '💎',
  '🔮',
  '🪞',
  '🎀',
  '📸',
  '🧩',
  '♠️',
  '♣️',
  '♥️',
  '♦️'
];

const TOTAL_FLOATERS_DESKTOP = 80;
const TOTAL_FLOATERS_MOBILE = 15;

@Component({
  selector: 'app-floating-emoji-background',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pointer-events-none absolute inset-0 overflow-hidden',
    'aria-hidden': 'true'
  },
  template: `
    @for (emoji of emojis(); track emoji.id) {
      <span
        class="absolute select-none blur-[0.5px]"
        [style.left]="emoji.left"
        [style.top]="emoji.top"
        [style.fontSize.px]="emoji.size"
        [style.opacity]="emoji.opacity"
        [style.animation]="emoji.animation + ' ' + emoji.duration + 's ease-in-out infinite'"
        [style.animationDelay]="emoji.delay + 's'"
      >
        {{ emoji.value }}
      </span>
    }
  `
})
export class FloatingEmojiBackgroundComponent {
  protected readonly emojis = signal<FloatingEmoji[]>(this.createEmojis());

  private createEmojis(): FloatingEmoji[] {
    const total =
      typeof window !== 'undefined' && window.innerWidth < 768
        ? TOTAL_FLOATERS_MOBILE
        : TOTAL_FLOATERS_DESKTOP;

    return Array.from({ length: total }).map((_, index) => {
      const value = FLOATING_EMOJIS[(index + Math.floor(Math.random() * FLOATING_EMOJIS.length)) % FLOATING_EMOJIS.length];
      const randomSuffix =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2, 8);

      return {
        id: `float-${index}-${randomSuffix}`,
        value,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: this.randomInRange(20, 84),
        duration: this.randomInRange(10, 26),
        delay: this.randomInRange(-12, 10),
        opacity: this.randomInRange(0.15, 0.5),
        animation: Math.random() > 0.5 ? 'float' : 'drift'
      };
    });
  }

  private randomInRange(min: number, max: number): number {
    if (min < 1) {
      return Number((Math.random() * (max - min) + min).toFixed(2));
    }

    return Math.floor(Math.random() * (max - min) + min);
  }
}
