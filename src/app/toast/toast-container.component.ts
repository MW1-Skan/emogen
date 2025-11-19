import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'fixed right-5 top-5 z-[12000] flex w-full max-w-[420px] flex-col gap-3 pointer-events-none'
  },
  template: `
    @for (toast of toasts(); track toast.id) {
      <article
        class="emogen-toast-card pointer-events-auto"
        [class.emogen-toast-card-success]="toast.severity === 'success'"
        [class.emogen-toast-card-info]="toast.severity === 'info'"
        [class.emogen-toast-card-error]="toast.severity === 'error'"
        [class.emogen-toast-card-exit]="toast.exiting"
        role="status"
        aria-live="polite"
        (click)="handleDismiss(toast.id)"
      >
        <div class="emogen-toast-content">
          <span class="emogen-toast-text">{{ toast.detail }}</span>
        </div>
      </article>
    }
  `
})
export class ToastContainerComponent {
  private readonly toast = inject(ToastService);
  protected readonly toasts = computed(() => this.toast.toasts());

  protected handleDismiss(id: string): void {
    this.toast.remove(id);
  }
}
