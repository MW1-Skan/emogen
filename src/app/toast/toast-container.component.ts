import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col gap-3 sm:inset-auto sm:right-6 sm:w-80'
  },
  template: `
    @for (toast of toasts(); track toast.id) {
      <article [class]="toastClass(toast.type)" role="status" aria-live="polite">
        <div class="flex items-center justify-between gap-4">
          <p class="font-medium">{{ toast.message }}</p>
          <button
            type="button"
            class="rounded-full bg-black/20 px-3 py-1 text-xs uppercase tracking-wide text-white/80 transition hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            (click)="dismiss(toast.id)"
          >
            Close
          </button>
        </div>
      </article>
    }
  `
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  protected dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  protected toastClass(type: ToastType): string {
    const base =
      'pointer-events-auto rounded-2xl border p-4 text-sm text-white shadow-2xl backdrop-blur-lg bg-gradient-to-br';
    const palette: Record<ToastType, string> = {
      success: 'from-emerald-500/30 to-emerald-500/10 border-emerald-400/70',
      info: 'from-white/20 to-white/5 border-white/20',
      error: 'from-rose-500/30 to-rose-500/10 border-rose-400/70'
    };

    return `${base} ${palette[type] ?? palette.info}`;
  }
}
